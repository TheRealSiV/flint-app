package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/flint-app/api/internal/db"
	"github.com/flint-app/api/internal/ranker"
)

// MakeGetFeed returns the /v1/feed handler closed over a db.Queries instance.
// If queries is nil the handler returns mock-empty data so the server still starts.
func MakeGetFeed(queries *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		if queries == nil {
			json.NewEncoder(w).Encode(map[string]any{"cards": []any{}, "nextCursor": ""})
			return
		}

		// Use a guest user ID until auth is wired up.
		userID := "00000000-0000-0000-0000-000000000000"
		language := r.URL.Query().Get("lang")
		if language == "" {
			language = "en"
		}

		candidates, err := queries.GetFeedCandidates(r.Context(), userID, language)
		if err != nil {
			http.Error(w, "db error", http.StatusInternalServerError)
			return
		}

		// Convert to ranker.Card for scoring.
		rc := make([]ranker.Card, len(candidates))
		for i, c := range candidates {
			rc[i] = ranker.Card{
				ID:         c.ID,
				Type:       c.Type,
				Tags:       c.Tags,
				DueAt:      c.DueAt,
				LastSeenAt: c.LastSeenAt,
			}
		}
		ranked := ranker.Rank(rc, &ranker.UserHistory{}, 20)

		// Build response cards from ranked results.
		cards := make([]map[string]any, 0, len(ranked))
		// Index candidates by ID for O(1) lookup.
		byID := make(map[string]db.FeedCandidate, len(candidates))
		for _, c := range candidates {
			byID[c.ID] = c
		}
		for _, rc := range ranked {
			c := byID[rc.ID]
			card := map[string]any{
				"id":   c.ID,
				"type": c.Type,
				"tags": c.Tags,
			}
			if c.Front != "" {
				card["front"] = c.Front
			}
			if c.Back != nil {
				card["back"] = *c.Back
			}
			if c.Context != nil {
				card["context"] = *c.Context
			}
			if c.SourceName != nil {
				card["source"] = *c.SourceName
			}
			cards = append(cards, card)
		}

		json.NewEncoder(w).Encode(map[string]any{
			"cards":      cards,
			"nextCursor": "",
		})
	}
}

// GetThread returns a rabbit-hole sub-feed (5–8 related cards).
func GetThread(w http.ResponseWriter, r *http.Request) {
	_ = chi.URLParam(r, "id")
	// TODO: fetch thread by ID from DB
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{"cards": []any{}})
}
