package handlers

import (
	"encoding/json"
	"net/http"
)

func GetCard(w http.ResponseWriter, r *http.Request) {
	// TODO: fetch card by chi.URLParam(r, "id") — SSR-friendly for share pages
	json.NewEncoder(w).Encode(map[string]any{"card": nil})
}

// ReactCard handles love | blown | knew | bookmark | deeper.
// Idempotent: re-sending the same kind toggles it off.
func ReactCard(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Kind string `json:"kind"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	// TODO: upsert into card_progress.reaction, emit feed_event
	w.WriteHeader(http.StatusNoContent)
}

// SubmitQuiz records the user's answer and updates the SR state.
func SubmitQuiz(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Picked int `json:"picked"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	// TODO: compute FSRS grade (correct/wrong), update card_progress
	w.WriteHeader(http.StatusNoContent)
}
