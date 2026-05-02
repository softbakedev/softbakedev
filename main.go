package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net"
	"net/http"
	"net/mail"
	"net/smtp"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"
)

type contactMessage struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Company string `json:"company"`
	Message string `json:"message"`
}

type mailSender interface {
	Send(message contactMessage) error
}

type smtpMailer struct {
	host     string
	port     string
	username string
	password string
	from     string
	to       string
}

const contentSecurityPolicy = "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; img-src 'self' https: data:; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; font-src 'self' data:"

type rateLimiter struct {
	limit  int
	window time.Duration
	now    func() time.Time

	mu      sync.Mutex
	clients map[string]rateLimitEntry
}

type rateLimitEntry struct {
	count       int
	windowStart time.Time
}

func main() {
	distDir := envOrDefault("DIST_DIR", "dist")
	addr := ":" + envOrDefault("PORT", "8080")
	server := &http.Server{
		Addr:              addr,
		Handler:           newServer(distDir, newSMTPMailerFromEnv()),
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("softbakedev listening on %s", addr)
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}

func newServer(distDir string, mailer mailSender) http.Handler {
	mux := http.NewServeMux()
	contactLimiter := newRateLimiter(5, time.Minute)
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		_, _ = w.Write([]byte("ok\n"))
	})
	mux.HandleFunc("POST /api/contact", rateLimitHandler(contactLimiter, contactHandler(mailer)))
	mux.HandleFunc("/api/", func(w http.ResponseWriter, _ *http.Request) {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "not found"})
	})
	mux.HandleFunc("/", spaHandler(distDir))
	return securityHeaders(mux)
}

func securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Security-Policy", contentSecurityPolicy)
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
		next.ServeHTTP(w, r)
	})
}

func newRateLimiter(limit int, window time.Duration) *rateLimiter {
	return &rateLimiter{
		limit:   limit,
		window:  window,
		now:     time.Now,
		clients: map[string]rateLimitEntry{},
	}
}

func (l *rateLimiter) allow(key string) bool {
	l.mu.Lock()
	defer l.mu.Unlock()

	now := l.now()
	entry := l.clients[key]
	if entry.windowStart.IsZero() || now.Sub(entry.windowStart) >= l.window {
		l.clients[key] = rateLimitEntry{count: 1, windowStart: now}
		return true
	}
	if entry.count >= l.limit {
		return false
	}
	entry.count++
	l.clients[key] = entry
	return true
}

func rateLimitHandler(limiter *rateLimiter, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !limiter.allow(clientIP(r)) {
			w.Header().Set("Retry-After", strconv.Itoa(int(limiter.window.Seconds())))
			writeJSON(w, http.StatusTooManyRequests, map[string]string{"error": "too many requests"})
			return
		}
		next(w, r)
	}
}

func clientIP(r *http.Request) string {
	if forwardedFor := r.Header.Get("X-Forwarded-For"); forwardedFor != "" {
		return strings.TrimSpace(strings.Split(forwardedFor, ",")[0])
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err == nil {
		return host
	}
	return r.RemoteAddr
}

func contactHandler(mailer mailSender) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var message contactMessage
		if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 64*1024)).Decode(&message); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON"})
			return
		}

		normalized, err := validateContactMessage(message)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
			return
		}

		if err := mailer.Send(normalized); err != nil {
			log.Printf("contact email failed: %v", err)
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "message could not be sent"})
			return
		}

		writeJSON(w, http.StatusAccepted, map[string]string{"status": "sent"})
	}
}

func validateContactMessage(message contactMessage) (contactMessage, error) {
	message.Name = strings.TrimSpace(message.Name)
	message.Email = strings.TrimSpace(message.Email)
	message.Company = strings.TrimSpace(message.Company)
	message.Message = strings.TrimSpace(message.Message)

	if message.Name == "" {
		return message, errors.New("name is required")
	}
	if message.Email == "" {
		return message, errors.New("email is required")
	}
	if _, err := mail.ParseAddress(message.Email); err != nil {
		return message, errors.New("email is invalid")
	}
	if message.Message == "" {
		return message, errors.New("message is required")
	}

	return message, nil
}

func spaHandler(distDir string) http.HandlerFunc {
	fileServer := http.FileServer(http.Dir(distDir))

	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet && r.Method != http.MethodHead {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		requestPath := filepath.Clean(strings.TrimPrefix(r.URL.Path, "/"))
		if requestPath == "." {
			requestPath = "index.html"
		}
		fullPath := filepath.Join(distDir, requestPath)

		if info, err := os.Stat(fullPath); err == nil && !info.IsDir() {
			fileServer.ServeHTTP(w, r)
			return
		}

		indexPath := filepath.Join(distDir, "index.html")
		if _, err := os.Stat(indexPath); err != nil {
			http.NotFound(w, r)
			return
		}
		http.ServeFile(w, r, indexPath)
	}
}

func newSMTPMailerFromEnv() smtpMailer {
	return smtpMailer{
		host:     envOrDefault("SMTP_HOST", "smtp.gmail.com"),
		port:     envOrDefault("SMTP_PORT", "587"),
		username: os.Getenv("SMTP_USER"),
		password: os.Getenv("SMTP_PASS"),
		from:     os.Getenv("MAIL_FROM"),
		to:       os.Getenv("MAIL_TO"),
	}
}

func (m smtpMailer) Send(message contactMessage) error {
	if err := m.validate(); err != nil {
		return err
	}

	addr := m.host + ":" + m.port
	auth := smtp.PlainAuth("", m.username, m.password, m.host)
	body := m.renderMessage(message)

	return smtp.SendMail(addr, auth, m.from, []string{m.to}, []byte(body))
}

func (m smtpMailer) validate() error {
	missing := []string{}
	values := map[string]string{
		"SMTP_HOST": m.host,
		"SMTP_PORT": m.port,
		"SMTP_USER": m.username,
		"SMTP_PASS": m.password,
		"MAIL_FROM": m.from,
		"MAIL_TO":   m.to,
	}
	for name, value := range values {
		if strings.TrimSpace(value) == "" {
			missing = append(missing, name)
		}
	}
	if len(missing) > 0 {
		return fmt.Errorf("missing SMTP configuration: %s", strings.Join(missing, ", "))
	}
	if _, err := strconv.Atoi(m.port); err != nil {
		return fmt.Errorf("SMTP_PORT must be numeric: %w", err)
	}
	return nil
}

func (m smtpMailer) renderMessage(message contactMessage) string {
	subject := sanitizeHeader("New softbake.dev order from " + message.Name)
	replyTo := sanitizeHeader(message.Email)

	return strings.Join([]string{
		"From: " + sanitizeHeader(m.from),
		"To: " + sanitizeHeader(m.to),
		"Reply-To: " + replyTo,
		"Subject: " + subject,
		"MIME-Version: 1.0",
		"Content-Type: text/plain; charset=UTF-8",
		"",
		"New softbake.dev contact request",
		"",
		"Name: " + message.Name,
		"Email: " + message.Email,
		"Company: " + emptyFallback(message.Company, "-"),
		"",
		message.Message,
		"",
	}, "\r\n")
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}

func envOrDefault(name string, fallback string) string {
	if value := strings.TrimSpace(os.Getenv(name)); value != "" {
		return value
	}
	return fallback
}

func sanitizeHeader(value string) string {
	value = strings.ReplaceAll(value, "\r", " ")
	value = strings.ReplaceAll(value, "\n", " ")
	return strings.TrimSpace(value)
}

func emptyFallback(value string, fallback string) string {
	if strings.TrimSpace(value) == "" {
		return fallback
	}
	return value
}
