package main

import (
	"log/slog"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/learnscroll/api/internal/handlers"
)

func main() {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RealIP)

	r.Route("/v1", func(r chi.Router) {
		// Feed
		r.Get("/feed", handlers.GetFeed)
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
	slog.Info("learnscroll api starting", "addr", addr)
	if err := http.ListenAndServe(addr, r); err != nil {
		slog.Error("server failed", "err", err)
		os.Exit(1)
	}
}
