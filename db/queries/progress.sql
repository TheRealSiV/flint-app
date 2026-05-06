-- name: GetProgress :one
SELECT
  u.streak_count,
  u.daily_target,
  COUNT(fe.id) FILTER (WHERE fe.created_at > now() - interval '1 day') AS done_today,
  COUNT(cp.card_id) FILTER (WHERE cp.due_at <= now()) AS due_count
FROM users u
LEFT JOIN feed_events fe ON fe.user_id = u.id AND fe.kind = 'impression'
LEFT JOIN card_progress cp ON cp.user_id = u.id
WHERE u.id = @user_id
GROUP BY u.streak_count, u.daily_target;

-- name: UpsertCardProgress :exec
INSERT INTO card_progress (user_id, card_id, stability, difficulty, due_at, last_seen_at, reps, lapses, reaction)
VALUES (@user_id, @card_id, @stability, @difficulty, @due_at, now(), @reps, @lapses, @reaction)
ON CONFLICT (user_id, card_id) DO UPDATE SET
  stability    = EXCLUDED.stability,
  difficulty   = EXCLUDED.difficulty,
  due_at       = EXCLUDED.due_at,
  last_seen_at = now(),
  reps         = EXCLUDED.reps,
  lapses       = EXCLUDED.lapses,
  reaction     = COALESCE(EXCLUDED.reaction, card_progress.reaction);

-- name: GetDueCards :many
SELECT c.*, cp.due_at, cp.stability
FROM card_progress cp
JOIN cards c ON c.id = cp.card_id
WHERE cp.user_id = @user_id AND cp.due_at <= now()
ORDER BY cp.due_at ASC
LIMIT 50;
