package handlers

import (
	"encoding/json"
	"net/http"
)

func GetKnownWords(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(map[string]any{"words": []string{}})
}

func MarkWordKnown(w http.ResponseWriter, r *http.Request) {
	// TODO: upsert into known_words
	w.WriteHeader(http.StatusNoContent)
}

// Explain answers a user's question about a specific card (3–4 sentences max).
func Explain(w http.ResponseWriter, r *http.Request) {
	// TODO: call enrich service via RPC; forward Claude Haiku response
	json.NewEncoder(w).Encode(map[string]any{"text": ""})
}

// Tutor handles language-mode chat: sentence generation, correction, i+1 surfacing.
func Tutor(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(map[string]any{"text": ""})
}

// SharePreview returns a signed R2 URL for a generated share PNG.
func SharePreview(w http.ResponseWriter, r *http.Request) {
	// TODO: render card via headless Chromium or html/template + image/draw
	json.NewEncoder(w).Encode(map[string]any{"url": ""})
}

func SubmitCard(w http.ResponseWriter, r *http.Request) {
	// TODO: validate payload, insert into submissions, enqueue moderation job
	w.WriteHeader(http.StatusAccepted)
}
