package handlers

import (
	"encoding/json"
	"net/http"
)

func GetProgress(w http.ResponseWriter, r *http.Request) {
	// TODO: return streak, daily goal, topic bars, due-review count
	json.NewEncoder(w).Encode(map[string]any{
		"streak":    0,
		"dailyGoal": 10,
		"doneToday": 0,
		"dueCount":  0,
		"topics":    []any{},
	})
}

// SyncProgress accepts a batch of client-side events (offline-first).
// The client queues events in on-device SQLite and flushes here.
func SyncProgress(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Events []map[string]any `json:"events"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	// TODO: upsert feed_events, recompute card_progress FSRS state
	w.WriteHeader(http.StatusNoContent)
}

// GetDue returns cards due for spaced-repetition review.
func GetDue(w http.ResponseWriter, r *http.Request) {
	// TODO: SELECT from card_progress WHERE due_at <= now() ORDER BY due_at LIMIT 50
	json.NewEncoder(w).Encode(map[string]any{"cards": []any{}})
}
