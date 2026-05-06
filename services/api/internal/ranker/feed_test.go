package ranker_test

import (
	"testing"
	"time"

	"github.com/learnscroll/api/internal/ranker"
)

func TestSRBoostLiftsOverdueCards(t *testing.T) {
	past := time.Now().Add(-1 * time.Hour)
	overdue := ranker.Card{ID: "a", Type: "vocab", DueAt: &past}
	fresh   := ranker.Card{ID: "b", Type: "vocab"}

	h := &ranker.UserHistory{}
	if ranker.Score(overdue, h) <= ranker.Score(fresh, h) {
		t.Error("overdue card should score higher than fresh card")
	}
}

func TestTypeBalancePenalisesOverRepresentation(t *testing.T) {
	h := &ranker.UserHistory{
		RecentTypes: []string{"vocab","vocab","vocab","vocab","vocab","vocab","vocab","vocab","fact","fact",
			"vocab","vocab","vocab","vocab","vocab","vocab","vocab","vocab","fact","fact"},
	}
	vocabCard := ranker.Card{ID: "v", Type: "vocab"}
	factCard  := ranker.Card{ID: "f", Type: "fact"}

	if ranker.Score(vocabCard, h) >= ranker.Score(factCard, h) {
		t.Error("over-represented vocab type should score lower than fact")
	}
}
