package handlers

import (
	"encoding/json"
	"net/http"
)

// GetFeed returns the next 20 ranked cards for the authenticated user.
// Query params: cursor (opaque string), types (comma-separated card types).
//
// Mix rule (server-side):
//   35% vocab · 30% fact/concept · 20% quiz · 15% sentence
//   SR-boost: cards due for review are up-ranked by 2×.
func GetFeed(w http.ResponseWriter, r *http.Request) {
	// TODO: read userID from session
	// TODO: call ranker.Rank(ctx, userID, cursor, types)
	// TODO: advance cursor and return cards
	json.NewEncoder(w).Encode(map[string]any{
		"cards":      []any{},
		"nextCursor": "",
	})
}

// GetThread returns a rabbit-hole sub-feed (5–8 related cards).
func GetThread(w http.ResponseWriter, r *http.Request) {
	// TODO: fetch thread by chi.URLParam(r, "id")
	json.NewEncoder(w).Encode(map[string]any{"cards": []any{}})
}
