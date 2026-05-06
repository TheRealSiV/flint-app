# Flint

Anti-doomscroll. Learn while you scroll — Japanese vocabulary, history, biology, and more, delivered as a continuous feed of bite-sized cards.

Free · Open source · No ads · No paywalls · Self-hostable.

## Screenshots

_Coming soon_

## Quick start (self-host)

```bash
git clone https://github.com/flint-app/app
cd app/deploy
cp .env.example .env   # fill in POSTGRES_PASSWORD, SESSION_SECRET
docker compose up -d
```

Full guide: [deploy/SELFHOST.md](deploy/SELFHOST.md)

## Stack

| Layer | Choice |
|---|---|
| Mobile | React Native (Expo) |
| Web | Next.js 15 PWA |
| API | Go + chi + sqlc |
| DB | PostgreSQL 16 + pgvector |
| AI jobs | Claude Haiku |
| SR | FSRS-5 |
| Deploy | Docker Compose + Hetzner |

Architecture deep-dive: [/architecture](/architecture)

## Repo layout

```
apps/
  web/          Next.js 15 PWA
  mobile/       React Native (Expo)
services/
  api/          Go REST + WebSocket API
  enrich/       Claude Haiku batch worker
  ingest/       flint CLI (Anki, Tatoeba, Wikipedia, OpenStax)
packages/
  core/         Shared types, API client, FSRS, mix algorithm
  ui/           Shared card components
  icons/        Inline SVG diagram set
db/             Postgres migrations, sqlc queries, dev seed
content/        Community YAML cards — PRs welcome
deploy/         Docker Compose, Dockerfiles, Caddy, Terraform
```

## Contributing cards

See [content/CONTRIBUTING.md](content/CONTRIBUTING.md). Cards are plain YAML — no code required.

## License

MIT
