package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/flint-app/api/internal/db"
	"github.com/flint-app/api/internal/handlers"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	// Connect to Postgres (optional in dev — handlers degrade gracefully when nil).
	var queries *db.Queries
	if dsn := os.Getenv("DATABASE_URL"); dsn != "" {
		pool, err := pgxpool.New(context.Background(), dsn)
		if err != nil {
			slog.Error("failed to connect to postgres", "err", err)
			os.Exit(1)
		}
		defer pool.Close()
		queries = db.New(pool)
		slog.Info("connected to postgres")
	} else {
		slog.Warn("DATABASE_URL not set — running without database")
	}

	r := chi.NewRouter()
	r.Use(corsMiddleware)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RealIP)

	r.Route("/v1", func(r chi.Router) {
		// Feed
		r.Get("/feed", handlers.MakeGetFeed(queries))
		r.Get("/threads/{id}", handlers.GetThread)

		// Cards
		r.Get("/cards/{id}", handlers.GetCard)
		r.Post("/cards/{id}/react", handlers.ReactCard)
		r.Post("/cards/{id}/quiz", handlers.SubmitQuiz)

		// Progress
		r.Get("/progress", handlers.GetProgress)
		r.Post("/progress/sync", handlers.SyncProgress)
		r.Get("/progress/due", handlers.GetDue)

		// Language
		r.Get("/vocab/known", handlers.GetKnownWords)
		r.Post("/vocab/known", handlers.MarkWordKnown)

		// AI
		r.Post("/ai/explain", handlers.Explain)
		r.Post("/ai/tutor", handlers.Tutor)

		// Share
		r.Post("/share/preview", handlers.SharePreview)

		// Auth
		r.Post("/auth/magic", handlers.MagicLink)
		r.Post("/auth/passkey", handlers.Passkey)

		// Community
		r.Post("/community/submit", handlers.SubmitCard)
	})

	addr := os.Getenv("ADDR")
	if addr == "" {
		addr = ":8080"
	}
	slog.Info("flint api starting", "addr", addr)
	if err := http.ListenAndServe(addr, r); err != nil {
		slog.Error("server failed", "err", err)
		os.Exit(1)
	}
}
