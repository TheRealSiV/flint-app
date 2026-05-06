package handlers

import (
	"encoding/json"
	"net/http"
)

// MagicLink sends a one-time login link to the provided email.
func MagicLink(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Email string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	// TODO: generate token, store in Redis with 15m TTL, send email
	w.WriteHeader(http.StatusAccepted)
}

// Passkey handles WebAuthn registration and authentication.
func Passkey(w http.ResponseWriter, r *http.Request) {
	// TODO: go-webauthn library; store credentials in users table
	json.NewEncoder(w).Encode(map[string]any{"challenge": ""})
}
