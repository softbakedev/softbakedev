# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS web-builder
WORKDIR /app/softbakedev

RUN corepack enable
RUN corepack prepare pnpm@8.15.9 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
COPY --from=recipes . /app/recipes
RUN pnpm build

FROM golang:1.23-alpine AS go-builder
WORKDIR /app/softbakedev

COPY go.mod ./
RUN go mod download

COPY main.go ./
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/softbakedev .

FROM alpine:3.21
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY --from=go-builder /out/softbakedev /app/softbakedev
COPY --from=web-builder /app/softbakedev/dist /app/dist

ENV PORT=8080
ENV DIST_DIR=/app/dist
EXPOSE 8080

USER app
ENTRYPOINT ["/app/softbakedev"]
