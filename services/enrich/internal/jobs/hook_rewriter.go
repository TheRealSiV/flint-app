package jobs

import (
	"context"
	"fmt"
)

// HookRewriteJob rewrites a raw card hook into the Flint voice:
// punchy, concrete, surprising — one sentence that earns the scroll stop.
//
// Prompt strategy: few-shot with curated before/after pairs from fixtures/hooks/.
// Model: Claude Haiku (fast + cheap; ~$0.00025 per card).
type HookRewriteJob struct {
	CardID string `json:"card_id"`
}

func (j *HookRewriteJob) Kind() string { return "hook_rewrite" }

func (j *HookRewriteJob) Work(ctx context.Context) error {
	// 1. Load card from DB
	// 2. Load fixtures for card.tags[0] (e.g. fixtures/hooks/biology.yaml)
	// 3. Build few-shot prompt
	// 4. Call Claude Haiku API
	// 5. Update cards.front WHERE id = j.CardID
	return fmt.Errorf("TODO: implement hook rewriter")
}

// systemPrompt is the shared voice guide injected into every rewrite request.
const systemPrompt = `You rewrite educational card hooks into the Flint voice.

Rules:
- One sentence. Max 120 characters.
- Start with the surprising fact, not the topic label.
- Concrete nouns > abstractions ("3 hearts" not "unusual anatomy").
- Present tense, active voice.
- No "Did you know" or "Fun fact" openers.
- End without a period — the hook trails off into curiosity.

Return only the rewritten hook. No explanation.`
