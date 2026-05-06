package jobs

import (
	"context"
	"fmt"
)

// QuizDistractorsJob generates 2 plausible-but-wrong answer options for a fact card,
// turning it into a 3-option quiz card.
type QuizDistractorsJob struct {
	CardID string `json:"card_id"`
}

func (j *QuizDistractorsJob) Kind() string { return "quiz_distractors" }

func (j *QuizDistractorsJob) Work(ctx context.Context) error {
	// 1. Load card
	// 2. Prompt Haiku: "Given this correct answer, generate 2 wrong-but-plausible distractors"
	// 3. Update cards.quiz_options
	return fmt.Errorf("TODO: implement distractor generation")
}
