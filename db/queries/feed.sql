-- name: GetFeedCandidates :many
-- Returns cards the user has not seen in the last 72 hours, plus all due SR cards.
SELECT c.id, c.type, c.tags, cp.due_at, cp.last_seen_at
FROM cards c
LEFT JOIN card_progress cp ON cp.card_id = c.id AND cp.user_id = @user_id
WHERE c.approved = true
  AND c.language = @language
  AND (cp.last_seen_at IS NULL OR cp.last_seen_at < now() - interval '72 hours'
       OR cp.due_at <= now())
ORDER BY cp.due_at ASC NULLS LAST
LIMIT 200;

-- name: GetThread :many
SELECT c.*
FROM cards c
JOIN unnest(@related_ids::uuid[]) AS rid ON c.id = rid
WHERE c.approved = true
ORDER BY array_position(@related_ids::uuid[], c.id);
