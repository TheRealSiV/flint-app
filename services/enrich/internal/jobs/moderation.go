package jobs

import (
	"context"
	"fmt"
)

type ModerationVerdict string

const (
	VerdictApprove ModerationVerdict = "approved"
	VerdictFlag    ModerationVerdict = "flagged"
	VerdictReject  ModerationVerdict = "rejected"
)

// ModerationJob auto-moderates a community card submission.
// Checks: factual plausibility, source citation, duplicate detection, policy.
type ModerationJob struct {
	SubmissionID string `json:"submission_id"`
}

func (j *ModerationJob) Kind() string { return "moderation" }

func (j *ModerationJob) Work(ctx context.Context) error {
	// 1. Load submission from DB
	// 2. Run duplicate check (pgvector cosine similarity)
	// 3. Call Haiku for policy + factual check
	// 4. Update submissions.status + reason
	// 5. If approved: insert into cards table with approved=false (human final check)
	return fmt.Errorf("TODO: implement moderation")
}
