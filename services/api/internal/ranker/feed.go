package ranker

import "time"

// Card is the minimal view the ranker needs. Full card data is fetched after ranking.
type Card struct {
	ID         string
	Type       string // fact | vocab | sentence | quiz | concept
	Tags       []string
	DueAt      *time.Time // nil if not in SR queue
	LastSeenAt *time.Time
}

// Score computes a ranking score for a single card given the user's history.
//
// Factors (all in [0,1], summed with weights):
//   - topicAffinity  0.35  — how often user dwells on this tag
//   - typeBalance    0.20  — penalise over-represented types in recent feed
//   - srBoost        0.25  — 1.0 if card is due for review, else 0
//   - recency        0.20  — decays over 72 h since card was last surfaced
//
// NO LLM in this path. Pure arithmetic; must be < 1ms per card.
func Score(c Card, history *UserHistory) float64 {
	topic   := topicAffinity(c.Tags, history)
	balance := typeBalance(c.Type, history)
	sr      := srBoost(c.DueAt)
	rec     := recency(c.LastSeenAt)

	return 0.35*topic + 0.20*balance + 0.25*sr + 0.20*rec
}

// Rank returns the top-n cards sorted by Score descending.
func Rank(candidates []Card, history *UserHistory, n int) []Card {
	scored := make([]struct {
		card  Card
		score float64
	}, len(candidates))
	for i, c := range candidates {
		scored[i] = struct {
			card  Card
			score float64
		}{c, Score(c, history)}
	}
	// simple insertion sort — n is small (≤ 20)
	for i := 1; i < len(scored); i++ {
		for j := i; j > 0 && scored[j].score > scored[j-1].score; j-- {
			scored[j], scored[j-1] = scored[j-1], scored[j]
		}
	}
	out := make([]Card, 0, n)
	for i := 0; i < n && i < len(scored); i++ {
		out = append(out, scored[i].card)
	}
	return out
}

// UserHistory is a lightweight snapshot of a user's recent activity.
type UserHistory struct {
	TagDwellSec    map[string]float64 // tag → total dwell seconds
	RecentTypes    []string           // last 20 card types shown
}

func topicAffinity(tags []string, h *UserHistory) float64 {
	if h == nil || len(tags) == 0 {
		return 0.5
	}
	var total float64
	for _, t := range tags {
		total += h.TagDwellSec[t]
	}
	if total > 300 {
		return 1.0
	}
	return total / 300.0
}

func typeBalance(cardType string, h *UserHistory) float64 {
	if h == nil {
		return 0.5
	}
	count := 0
	for _, t := range h.RecentTypes {
		if t == cardType {
			count++
		}
	}
	// penalise if > 30% of last 20 cards were this type
	excess := float64(count)/float64(len(h.RecentTypes)) - 0.3
	if excess <= 0 {
		return 1.0
	}
	return 1.0 - excess*2
}

func srBoost(dueAt *time.Time) float64 {
	if dueAt != nil && !dueAt.After(time.Now()) {
		return 1.0
	}
	return 0.0
}

func recency(lastSeen *time.Time) float64 {
	if lastSeen == nil {
		return 1.0 // never shown → full score
	}
	age := time.Since(*lastSeen).Hours()
	if age >= 72 {
		return 1.0
	}
	return age / 72.0
}
