export interface TreeNode {
  name: string;
  kind: 'root' | 'dir' | 'file';
  desc?: string;
  children?: TreeNode[];
}

export interface ApiRoute {
  group: string;
  method: 'GET' | 'POST' | 'WS';
  path: string;
  desc: string;
}

export const STACK = [
  { layer: 'Mobile',    pick: 'React Native (Expo SDK 51)',                 why: "Brief's pick. EAS for builds. Single iOS+Android codebase." },
  { layer: 'Web',       pick: 'Next.js 15 PWA',                             why: 'App Router. SSR for /card/[id] OG images — the share growth lever.' },
  { layer: 'Shared UI', pick: 'packages/ui (TS)',                           why: 'Card components shared between mobile and web. NativeWind or Tamagui for cross-platform styling.' },
  { layer: 'API',       pick: 'Go + chi + sqlc',                            why: 'Single static binary, ~10MB RAM idle. Type-safe SQL without ORM tax.' },
  { layer: 'Database',  pick: 'PostgreSQL 16 + pgvector',                   why: 'Cards, users, progress, embeddings. One Postgres, no microservice DB sprawl.' },
  { layer: 'Cache',     pick: 'Redis',                                      why: 'Per-user feed buffer (next 20). Rate limits. Session cache.' },
  { layer: 'Queue',     pick: 'River (Postgres-backed)',                    why: 'No new infra. Reuses your DB. Enrichment + moderation jobs.' },
  { layer: 'AI jobs',   pick: 'Claude Haiku via API',                       why: 'Hook rewriter, "Explain this", language tutor, moderation.' },
  { layer: 'Auth',      pick: 'Magic link + Passkey (cookie sessions)',     why: 'No JWT. No vendor. Trivial to revoke. Self-host friendly.' },
  { layer: 'SR',        pick: 'FSRS-rs (or pure-Go port)',                  why: 'Modern replacement for SM-2. Used by current Anki.' },
  { layer: 'Storage',   pick: 'Cloudflare R2',                              why: 'Audio (~15KB/file). Zero egress — critical for free product.' },
  { layer: 'CDN',       pick: 'Cloudflare',                                 why: 'Free tier covers all card text + images.' },
  { layer: 'Deploy',    pick: 'Docker Compose + Hetzner',                   why: '$10/$65/$220 VPS tiers. Caddy auto-HTTPS in front.' },
  { layer: 'Monorepo',  pick: 'pnpm workspaces + Turborepo',                why: 'Standard, fork-friendly. Go services live alongside in /services.' },
  { layer: 'CI',        pick: 'GitHub Actions',                             why: 'Free for public repos. Lints YAML community cards on every PR.' },
  { layer: 'Telemetry', pick: 'OpenTelemetry (optional)',                   why: 'No vendor baked in. Forkers can wire to whatever they like.' },
];

export const REPO_TREE: TreeNode = {
  name: 'flint', kind: 'root',
  children: [
    {
      name: 'apps', kind: 'dir', desc: 'User-facing apps. Each is independently deployable.',
      children: [
        {
          name: 'mobile', kind: 'dir', desc: 'React Native (Expo SDK 51). iOS + Android.',
          children: [
            { name: 'app/', kind: 'dir', desc: 'Expo Router file-based routing.' },
            { name: 'components/', kind: 'dir', desc: 'Mobile-only chrome (gestures, native sheets).' },
            { name: 'app.json', kind: 'file', desc: 'Expo config.' },
            { name: 'eas.json', kind: 'file', desc: 'EAS Build profiles (dev, preview, production).' },
            { name: 'package.json', kind: 'file' },
          ],
        },
        {
          name: 'web', kind: 'dir', desc: 'Next.js 15 App Router PWA. SSR for shareable /card/[id] OG images.',
          children: [
            { name: 'app/', kind: 'dir', desc: 'Next.js routes — feed, topics, progress, profile, /card/[id].' },
            { name: 'app/card/[id]/opengraph-image.tsx', kind: 'file', desc: 'Generates the share image at request time. THE growth lever.' },
            { name: 'public/manifest.json', kind: 'file', desc: 'PWA manifest. Installable on any device.' },
            { name: 'service-worker.ts', kind: 'file', desc: 'Offline buffer of next 20 cards.' },
            { name: 'package.json', kind: 'file' },
          ],
        },
      ],
    },
    {
      name: 'services', kind: 'dir', desc: 'Backend Go services. Each is a single static binary.',
      children: [
        {
          name: 'api', kind: 'dir', desc: 'REST + WebSocket public API. The only service exposed to the internet.',
          children: [
            { name: 'cmd/api/main.go', kind: 'file', desc: 'Entrypoint. Wires deps, starts chi router on :8080.' },
            { name: 'internal/handlers/feed.go',     kind: 'file', desc: 'GET /v1/feed, /v1/feed/stream (WS).' },
            { name: 'internal/handlers/cards.go',    kind: 'file', desc: 'GET/POST /v1/cards, react, bookmark.' },
            { name: 'internal/handlers/progress.go', kind: 'file', desc: 'GET /v1/progress, POST /v1/progress/sync.' },
            { name: 'internal/handlers/threads.go',  kind: 'file', desc: 'GET /v1/threads/:id (rabbit holes).' },
            { name: 'internal/handlers/auth.go',     kind: 'file', desc: 'Email magic-link + passkey.' },
            { name: 'internal/ranker/feed.go',       kind: 'file', desc: 'Weighted scoring. Topic affinity + type history + SR boost + recency. NO LLM.' },
            { name: 'internal/ranker/feed_test.go',  kind: 'file', desc: 'Snapshot tests on synthetic histories.' },
            { name: 'internal/db/',                  kind: 'dir',  desc: 'sqlc-generated query types. 100% type-safe SQL.' },
            { name: 'go.mod',                        kind: 'file' },
          ],
        },
        {
          name: 'enrich', kind: 'dir', desc: 'Batch worker. Runs Claude Haiku enrichment + moderation via River queue.',
          children: [
            { name: 'cmd/enrich/main.go',                kind: 'file', desc: 'Worker pool entrypoint.' },
            { name: 'internal/jobs/hook_rewriter.go',    kind: 'file', desc: 'Few-shot prompt + before/after fixtures per topic.' },
            { name: 'internal/jobs/quiz_distractors.go', kind: 'file', desc: 'Generates 2 distractors for fact→quiz conversion.' },
            { name: 'internal/jobs/related_cards.go',    kind: 'file', desc: 'Embedding-based; pgvector search for nearest 3.' },
            { name: 'internal/jobs/moderation.go',       kind: 'file', desc: 'Approve / flag / reject community submissions.' },
            { name: 'fixtures/hooks/',                   kind: 'dir',  desc: 'Curated before/after pairs. Edit these to tune voice.' },
          ],
        },
        {
          name: 'ingest', kind: 'dir', desc: 'CLI tools that turn raw sources into our card schema.',
          children: [
            { name: 'cmd/flint/main.go',           kind: 'file', desc: 'Single binary: `flint ingest <source> <path>`.' },
            { name: 'internal/sources/anki.go',    kind: 'file', desc: 'Reads .apkg (zip → SQLite). Maps to vocab/quiz cards.' },
            { name: 'internal/sources/tatoeba.go', kind: 'file', desc: 'TSV bulk parse. Sentence cards.' },
            { name: 'internal/sources/wiki.go',    kind: 'file', desc: 'MediaWiki API. Lead paragraphs → fact/concept.' },
            { name: 'internal/sources/openstax.go',kind: 'file', desc: 'OpenStax REST. Chapter Q&A → quiz cards.' },
            { name: 'internal/normalize/schema.go',kind: 'file', desc: 'Single output type. All sources land here.' },
          ],
        },
      ],
    },
    {
      name: 'packages', kind: 'dir', desc: 'Shared TypeScript code. Imported by both apps.',
      children: [
        { name: 'core/',   kind: 'dir', desc: 'Domain types (Card, User, Progress), API client, FSRS port, mix algorithm.' },
        { name: 'ui/',     kind: 'dir', desc: 'Card components (Fact, Vocab, Sentence, Quiz, Concept). Shared between mobile + web.' },
        { name: 'icons/',  kind: 'dir', desc: 'Inline SVG diagram set (octopus, silk-road, cell, etc.). Programmatic only — no rasters.' },
        { name: 'config/', kind: 'dir', desc: 'tsconfig, eslint, prettier presets.' },
      ],
    },
    {
      name: 'db', kind: 'dir', desc: 'PostgreSQL schema, migrations, seed data. Source of truth.',
      children: [
        { name: 'migrations/', kind: 'dir', desc: 'goose-style numbered SQL files. Forward-only.' },
        { name: 'queries/',    kind: 'dir', desc: 'sqlc input. Each .sql becomes Go functions.' },
        { name: 'sqlc.yaml',   kind: 'file' },
        { name: 'seed/',       kind: 'dir', desc: 'Dev fixtures — 200 cards, 5 users.' },
      ],
    },
    {
      name: 'content', kind: 'dir', desc: 'Community contributions. Plain YAML — easy to PR.',
      children: [
        { name: 'community/biology/',  kind: 'dir' },
        { name: 'community/history/',  kind: 'dir' },
        { name: 'community/japanese/', kind: 'dir' },
        { name: 'CONTRIBUTING.md',     kind: 'file', desc: 'Card schema, voice guide, examples of strong vs weak hooks.' },
        { name: 'schema.json',         kind: 'file', desc: 'JSON Schema for card YAML. Used by the CI linter.' },
      ],
    },
    {
      name: 'deploy', kind: 'dir', desc: 'Self-hosting reference. The most-read folder by forkers.',
      children: [
        { name: 'docker-compose.yml', kind: 'file', desc: 'One-command local + prod. Postgres + Redis + api + enrich.' },
        { name: 'Dockerfile.api',     kind: 'file', desc: 'Multi-stage. Final image ~25MB.' },
        { name: 'Dockerfile.enrich',  kind: 'file' },
        { name: 'caddy/Caddyfile',    kind: 'file', desc: "Reverse proxy + auto-HTTPS via Let's Encrypt." },
        { name: 'hetzner/',           kind: 'dir',  desc: 'Reference Terraform for the $10/$65/$220 VPS tiers.' },
        { name: 'SELFHOST.md',        kind: 'file', desc: '15-minute self-host guide. Tested every release.' },
      ],
    },
    {
      name: '.github', kind: 'dir', desc: 'CI: lint, test, build, lint community YAML, run moderation on PRs.',
      children: [
        { name: 'workflows/test.yml',    kind: 'file' },
        { name: 'workflows/build.yml',   kind: 'file' },
        { name: 'workflows/content.yml', kind: 'file', desc: 'Validates community/**.yaml against schema.' },
      ],
    },
    { name: 'README.md',          kind: 'file', desc: 'What it is, screenshots, 1-line install, link to SELFHOST.' },
    { name: 'LICENSE',            kind: 'file', desc: 'MIT.' },
    { name: 'pnpm-workspace.yaml', kind: 'file' },
    { name: 'turbo.json',         kind: 'file' },
  ],
};

export const API_ROUTES: ApiRoute[] = [
  { group: 'Feed',     method: 'GET',  path: '/v1/feed?cursor=&types=', desc: 'Returns next 20 cards. Mix rule applied server-side. Cursor is opaque.' },
  { group: 'Feed',     method: 'WS',   path: '/v1/feed/stream',         desc: 'Streams ranked cards as user scrolls. Backpressure-aware.' },
  { group: 'Feed',     method: 'GET',  path: '/v1/threads/:id',         desc: 'Rabbit hole sub-feed. 5–8 related cards.' },
  { group: 'Cards',    method: 'GET',  path: '/v1/cards/:id',           desc: 'Single card hydrate. SSR-friendly for share pages.' },
  { group: 'Cards',    method: 'POST', path: '/v1/cards/:id/react',     desc: 'Body: { kind: love|blown|knew|bookmark|deeper }. Idempotent.' },
  { group: 'Cards',    method: 'POST', path: '/v1/cards/:id/quiz',      desc: 'Body: { picked: int }. Records answer for SR weighting.' },
  { group: 'Progress', method: 'GET',  path: '/v1/progress',            desc: 'Streak, daily goal, topic bars, due-review queue.' },
  { group: 'Progress', method: 'POST', path: '/v1/progress/sync',       desc: 'Batch: client uploads N events. Brief §architecture.' },
  { group: 'Progress', method: 'GET',  path: '/v1/progress/due',        desc: 'Spaced-repetition due cards. Local-first; this is the catch-up sync.' },
  { group: 'Lang',     method: 'POST', path: '/v1/vocab/known',         desc: 'Mark word known. Updates i+1 model.' },
  { group: 'Lang',     method: 'GET',  path: '/v1/vocab/known',         desc: "Returns user's known-word set." },
  { group: 'AI',       method: 'POST', path: '/v1/ai/explain',          desc: 'Card-scoped chat. 3–4 sentence cap server-enforced.' },
  { group: 'AI',       method: 'POST', path: '/v1/ai/tutor',            desc: 'Language mode. Sentence gen, correction, i+1 surfacing.' },
  { group: 'Share',    method: 'POST', path: '/v1/share/preview',       desc: 'Returns signed URL to a generated PNG (9:16, 1:1, 16:9).' },
  { group: 'Auth',     method: 'POST', path: '/v1/auth/magic',          desc: 'Email magic link.' },
  { group: 'Auth',     method: 'POST', path: '/v1/auth/passkey',        desc: 'WebAuthn registration / login.' },
  { group: 'Submit',   method: 'POST', path: '/v1/community/submit',    desc: 'User card submission → enqueues moderation.' },
];

export const SCHEMA = `-- flint/db/migrations/001_init.sql

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
  kind       TEXT NOT NULL,
  payload    JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX fe_user_recent ON feed_events (user_id, created_at DESC);

CREATE TABLE submissions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id  UUID REFERENCES users(id),
  payload    JSONB NOT NULL,
  status     TEXT NOT NULL DEFAULT 'pending',
  reason     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);`.trim();

export const SCALING = [
  { tier: '0–1k users',    monthly: '$10',  setup: 'Single Hetzner CX22 (4GB). Postgres + Redis + api + enrich on one box. Caddy reverse proxy.' },
  { tier: '1k–20k users',  monthly: '$65',  setup: 'CX42 (16GB) for db+app. R2 bucket for audio. Cloudflare in front.' },
  { tier: '20k–100k users',monthly: '$220', setup: 'Split: db box (CX42), app box (CX32 ×2 behind LB), Redis on db box. Read replicas optional.' },
];

export const PIPELINE = [
  { step: '01 · Source',   name: 'Raw input',   desc: 'Anki .apkg, Tatoeba TSV, Wikipedia API, OpenStax JSON, community YAML.' },
  { step: '02 · Ingest',   name: 'flint CLI',   desc: 'One Go binary, one parser per source. Outputs the unified card schema.' },
  { step: '03 · Enrich',   name: 'Haiku batch', desc: 'Hook rewrite, distractors, related-card linking, difficulty tag, embedding.' },
  { step: '04 · Moderate', name: 'AI + human',  desc: 'Auto: facts, sources, dupes. Flagged → human queue. Rejected → reason logged.' },
  { step: '05 · Serve',    name: 'api → feed',  desc: 'Ranker pulls from cards + card_progress, applies mix rule, streams to client.' },
];
