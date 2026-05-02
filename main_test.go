package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

type recordingMailer struct {
	message contactMessage
	calls   int
	err     error
}

func (m *recordingMailer) Send(message contactMessage) error {
	m.calls++
	m.message = message
	return m.err
}

func TestHealthzReturnsOK(t *testing.T) {
	server := newServer(t.TempDir(), &recordingMailer{})
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodGet, "/healthz", nil)

	server.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got %d", recorder.Code)
	}
	if strings.TrimSpace(recorder.Body.String()) != "ok" {
		t.Fatalf("expected ok response, got %q", recorder.Body.String())
	}
}

func TestServesStaticFileFromDist(t *testing.T) {
	distDir := t.TempDir()
	if err := os.WriteFile(filepath.Join(distDir, "asset.txt"), []byte("static asset"), 0o644); err != nil {
		t.Fatal(err)
	}
	server := newServer(distDir, &recordingMailer{})
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodGet, "/asset.txt", nil)

	server.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got %d", recorder.Code)
	}
	if recorder.Body.String() != "static asset" {
		t.Fatalf("expected static file body, got %q", recorder.Body.String())
	}
}

func TestServesIndexForSPAFallback(t *testing.T) {
	distDir := t.TempDir()
	if err := os.WriteFile(filepath.Join(distDir, "index.html"), []byte("<main>spa</main>"), 0o644); err != nil {
		t.Fatal(err)
	}
	server := newServer(distDir, &recordingMailer{})
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodGet, "/recipes/how-to-turn-an-idea-into-a-product-recipe", nil)

	server.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf("expected 200 OK, got %d", recorder.Code)
	}
	if recorder.Body.String() != "<main>spa</main>" {
		t.Fatalf("expected SPA index body, got %q", recorder.Body.String())
	}
}

func TestContactRejectsMissingRequiredFields(t *testing.T) {
	mailer := &recordingMailer{}
	server := newServer(t.TempDir(), mailer)
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodPost, "/api/contact", strings.NewReader(`{"name":"Ada","email":"","message":""}`))

	server.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 Bad Request, got %d", recorder.Code)
	}
	if mailer.calls != 0 {
		t.Fatalf("expected mailer not to be called, got %d calls", mailer.calls)
	}
}

func TestContactSendsMessage(t *testing.T) {
	mailer := &recordingMailer{}
	server := newServer(t.TempDir(), mailer)
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodPost, "/api/contact", strings.NewReader(`{
		"name":"Ada Lovelace",
		"email":"ada@example.com",
		"company":"Analytical Engines Ltd",
		"message":"Please help us bake a product."
	}`))

	server.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusAccepted {
		t.Fatalf("expected 202 Accepted, got %d with body %s", recorder.Code, recorder.Body.String())
	}
	if mailer.calls != 1 {
		t.Fatalf("expected one mailer call, got %d", mailer.calls)
	}
	if mailer.message.Email != "ada@example.com" {
		t.Fatalf("expected email to be passed to mailer, got %q", mailer.message.Email)
	}
	var response map[string]string
	if err := json.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
		t.Fatal(err)
	}
	if response["status"] != "sent" {
		t.Fatalf("expected sent response, got %#v", response)
	}
}

func TestSecurityHeadersAreApplied(t *testing.T) {
	server := newServer(t.TempDir(), &recordingMailer{})
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodGet, "/healthz", nil)

	server.ServeHTTP(recorder, request)

	expectedHeaders := map[string]string{
		"Content-Security-Policy": "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; img-src 'self' https: data:; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; font-src 'self' data:",
		"Referrer-Policy":         "strict-origin-when-cross-origin",
		"X-Content-Type-Options":  "nosniff",
		"X-Frame-Options":         "DENY",
	}
	for name, value := range expectedHeaders {
		if recorder.Header().Get(name) != value {
			t.Fatalf("expected %s header %q, got %q", name, value, recorder.Header().Get(name))
		}
	}
}

func TestContactRateLimit(t *testing.T) {
	mailer := &recordingMailer{}
	server := newServer(t.TempDir(), mailer)
	body := `{"name":"Ada Lovelace","email":"ada@example.com","message":"Please help us bake a product."}`

	for i := 0; i < 5; i++ {
		recorder := httptest.NewRecorder()
		request := httptest.NewRequest(http.MethodPost, "/api/contact", strings.NewReader(body))
		request.RemoteAddr = "203.0.113.10:12345"

		server.ServeHTTP(recorder, request)

		if recorder.Code != http.StatusAccepted {
			t.Fatalf("request %d expected 202 Accepted, got %d with body %s", i+1, recorder.Code, recorder.Body.String())
		}
	}

	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodPost, "/api/contact", strings.NewReader(body))
	request.RemoteAddr = "203.0.113.10:12345"

	server.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusTooManyRequests {
		t.Fatalf("expected 429 Too Many Requests, got %d with body %s", recorder.Code, recorder.Body.String())
	}
	if mailer.calls != 5 {
		t.Fatalf("expected mailer to be called 5 times, got %d", mailer.calls)
	}
}
