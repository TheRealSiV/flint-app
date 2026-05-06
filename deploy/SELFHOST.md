# Self-hosting Flint in 15 minutes

## Requirements

- A Linux VPS (Hetzner CX22 or equivalent — 2 vCPU, 4GB RAM, $6/mo)
- Docker + Docker Compose v2
- A domain name pointing at the server

## Steps

### 1. Clone and configure

```bash
git clone https://github.com/flint-app/app
cd app/deploy
cp .env.example .env
```

Edit `.env`:

```env
POSTGRES_PASSWORD=<generate with: openssl rand -hex 32>
SESSION_SECRET=<generate with: openssl rand -hex 32>
ANTHROPIC_API_KEY=<your key — enrich worker won't start without it>
```

The enrich service is optional. If you skip the API key, cards will still work — hooks just won't be AI-rewritten and community submissions won't be auto-moderated.

### 2. Point your domain

Add an A record: `flint.yourdomain.com → <server IP>`

Edit `caddy/Caddyfile` and replace `flint.app` with your domain.

### 3. Start

```bash
docker compose pull
docker compose up -d
```

Caddy will auto-provision a TLS certificate. Give it ~30 seconds.

### 4. Seed data (optional)

```bash
docker compose exec postgres psql -U flint -d flint \
  -f /docker-entrypoint-initdb.d/001_dev_cards.sql
```

### 5. Verify

```bash
curl https://flint.yourdomain.com/v1/feed
```

You should see `{"cards":[],"nextCursor":""}` until you ingest content.

## Ingest your first cards

```bash
# Pull latest Tatoeba Japanese sentences (~5MB)
wget -O /tmp/tatoeba-ja.tsv https://downloads.tatoeba.org/exports/sentences.tar.bz2

# Run the ingest CLI
docker compose run --rm api flint ingest tatoeba /tmp/tatoeba-ja.tsv
```

## Upgrading

```bash
docker compose pull
docker compose up -d --remove-orphans
```

Migrations run automatically on startup via the `migrate` service.

## Scaling

See [Architecture → Hosting tiers](/architecture) for the $65 and $220 Hetzner setups.
