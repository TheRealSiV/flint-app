-- +goose Up

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TYPE card_type AS ENUM ('fact','vocab','sentence','quiz','concept');

CREATE TABLE cards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type            card_type NOT NULL,
  language        TEXT NOT NULL DEFAULT 'en',
  front           TEXT NOT NULL,
  back            TEXT,
  context         TEXT,
  source_url      TEXT,
  source_name     TEXT,
  tags            TEXT[] NOT NULL DEFAULT '{}',
  difficulty      SMALLINT CHECK (difficulty BETWEEN 1 AND 5),
  audio_url       TEXT,
  diagram_kind    TEXT,
  related_ids     UUID[] NOT NULL DEFAULT '{}',
  quiz_options    JSONB,
  quiz_answer_idx SMALLINT,
  embedding       vector(1024),
  approved        BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX cards_tags_gin   ON cards USING GIN (tags);
CREATE INDEX cards_front_trgm ON cards USING GIN (front gin_trgm_ops);
CREATE INDEX cards_emb_hnsw   ON cards USING hnsw (embedding vector_cosine_ops);

CREATE TABLE users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          CITEXT UNIQUE,
  handle         TEXT UNIQUE,
  language_goal  TEXT,
  daily_target   SMALLINT NOT NULL DEFAULT 10,
  mix_ratio      JSONB,
  streak_count   INT NOT NULL DEFAULT 0,
  streak_paused  BOOLEAN NOT NULL DEFAULT false,
  shield_used_at TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE card_progress (
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  card_id      UUID REFERENCES cards(id) ON DELETE CASCADE,
  stability    REAL NOT NULL DEFAULT 0,
  difficulty   REAL NOT NULL DEFAULT 0,
  due_at       TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ,
  reps         INT NOT NULL DEFAULT 0,
  lapses       INT NOT NULL DEFAULT 0,
  reaction     TEXT,
  PRIMARY KEY (user_id, card_id)
);

CREATE INDEX cp_due ON card_progress (user_id, due_at) WHERE due_at IS NOT NULL;

CREATE TABLE known_words (
  user_id   UUID REFERENCES users(id) ON DELETE CASCADE,
  language  TEXT NOT NULL,
  lemma     TEXT NOT NULL,
  marked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, language, lemma)
);

CREATE TABLE feed_events (
  id         BIGSERIAL PRIMARY KEY,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  card_id    UUID REFERENCES cards(id) ON DELETE CASCADE,
  kind       TEXT NOT NULL,  -- impression | dwell | react | skip | deeper
  payload    JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX fe_user_recent ON feed_events (user_id, created_at DESC);

CREATE TABLE submissions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id  UUID REFERENCES users(id),
  payload    JSONB NOT NULL,
  status     TEXT NOT NULL DEFAULT 'pending',  -- pending | approved | flagged | rejected
  reason     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- +goose Down
DROP TABLE IF EXISTS submissions, feed_events, known_words, card_progress, users, cards CASCADE;
DROP TYPE IF EXISTS card_type;
DROP EXTENSION IF EXISTS vector, pg_trgm, pgcrypto;
