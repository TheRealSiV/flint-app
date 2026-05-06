import { STACK, REPO_TREE, API_ROUTES, SCHEMA, SCALING, PIPELINE, TreeNode } from '@/lib/arch-data';

const mono = '"JetBrains Mono", "SF Mono", ui-monospace, Menlo, monospace';
const serif = '"Source Serif 4", Georgia, serif';
const sans  = '-apple-system, "SF Pro Text", system-ui, sans-serif';

const line  = 'rgba(60,60,67,0.10)';
const ink   = '#1a1814';
const muted = '#7a766f';
const accent= '#E2861A';
const panel = '#fff';
const bg    = '#FAF7F1';

// ── Typography helpers ──────────────────────────────────────────
function H2({ num, children }: { num: string; children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 600, letterSpacing: -0.4, margin: '56px 0 14px' }}>
      <span style={{ fontFamily: mono, fontSize: 12, color: muted, marginRight: 10, letterSpacing: 0.4 }}>{num}</span>
      {children}
    </h2>
  );
}

function Lede({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontSize: 14, color: muted, lineHeight: 1.55, maxWidth: '60ch', margin: '0 0 14px', ...style }}>
      {children}
    </p>
  );
}

function Inline({ children }: { children: React.ReactNode }) {
  return (
    <code style={{ fontFamily: mono, fontSize: 12.5, background: 'rgba(60,60,67,0.06)', padding: '1px 6px', borderRadius: 4 }}>
      {children}
    </code>
  );
}

// ── Repo tree ───────────────────────────────────────────────────
function TreeNodeEl({ node, depth }: { node: TreeNode; depth: number }) {
  const isDir = node.kind === 'dir' || node.kind === 'root';
  const trail = isDir ? '/' : '';
  const nameStyle: React.CSSProperties = {
    color: ink, fontWeight: isDir ? 600 : 400,
  };
  const descStyle: React.CSSProperties = {
    color: muted, fontSize: 11.5, paddingLeft: 8, flex: 1,
  };

  if (isDir && node.children?.length) {
    return (
      <details open={depth < 2} style={{ margin: 0 }}>
        <summary style={{
          cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'baseline',
          gap: 6, padding: '1px 0',
        }}>
          <span style={{ color: muted, fontSize: 9, width: 10, flexShrink: 0 }}>▸</span>
          <span style={nameStyle}>{node.name}{trail}</span>
          {node.desc && <span style={descStyle}>— {node.desc}</span>}
        </summary>
        <div style={{ paddingLeft: 16, borderLeft: `0.5px dashed ${line}`, marginLeft: 4 }}>
          {node.children.map((c, i) => <TreeNodeEl key={i} node={c} depth={depth + 1} />)}
        </div>
      </details>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, padding: '1px 0 1px 16px' }}>
      <span style={{ color: muted, width: 10, flexShrink: 0 }}>·</span>
      <span style={nameStyle}>{node.name}{trail}</span>
      {node.desc && <span style={descStyle}>— {node.desc}</span>}
    </div>
  );
}

// ── SQL syntax highlight (server-side, no runtime) ──────────────
function HighlightedSQL({ sql }: { sql: string }) {
  const keywords = /\b(CREATE|TABLE|TYPE|INDEX|EXTENSION|IF NOT EXISTS|PRIMARY KEY|REFERENCES|ON DELETE|CASCADE|DEFAULT|NOT NULL|UNIQUE|CHECK|BETWEEN|AND|USING|WHERE|AS|ENUM)\b/g;
  const types    = /\b(UUID|TEXT|JSONB|TIMESTAMPTZ|BOOLEAN|SMALLINT|INT|BIGSERIAL|REAL|CITEXT|vector)\b/g;
  const strings  = /'([^']*)'/g;
  const comments = /(--[^\n]*)/g;

  const lines = sql.split('\n');

  return (
    <pre style={{
      background: '#211e19', color: '#e8e2d4', padding: '16px 18px', borderRadius: 12,
      overflowX: 'auto', fontFamily: mono, fontSize: 12, lineHeight: 1.6, margin: '8px 0 0',
    }}>
      {lines.map((line, i) => {
        // simple tokeniser: highlight comments, then strings, then keywords, then types
        const parts: { text: string; kind: 'plain' | 'comment' | 'keyword' | 'type' | 'string' }[] = [];

        // check for comment line
        const commentIdx = line.indexOf('--');
        let codePart = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
        const commentPart = commentIdx >= 0 ? line.slice(commentIdx) : null;

        // split on strings first
        let remaining = codePart;
        remaining.replace(strings, (match, _, offset) => {
          parts.push({ text: remaining.slice(0, offset), kind: 'plain' });
          parts.push({ text: match, kind: 'string' });
          remaining = remaining.slice(offset + match.length);
          return match;
        });
        // remaining after string replacement — just add as plain
        // (simple approach: push the full codePart as plain, we'll style via spans after)

        return (
          <span key={i}>
            <LineHighlight text={codePart} />
            {commentPart && <span style={{ color: '#8a8676' }}>{commentPart}</span>}
            {'\n'}
          </span>
        );
      })}
    </pre>
  );
}

function LineHighlight({ text }: { text: string }) {
  // Tokenise: string literals > keywords > types > plain
  const tokens: { text: string; color: string }[] = [];
  let rest = text;
  let safety = 0;

  while (rest.length && safety++ < 500) {
    // String literal
    const strMatch = rest.match(/^(.*?)('(?:[^']|'')*')/);
    const kwMatch  = rest.match(/^(.*?)\b(CREATE TABLE|CREATE TYPE|CREATE INDEX|CREATE EXTENSION|IF NOT EXISTS|PRIMARY KEY|ON DELETE|CASCADE|NOT NULL|DEFAULT|REFERENCES|UNIQUE|CHECK|BETWEEN|USING|WHERE|AS|ENUM|CREATE)\b/i);
    const tyMatch  = rest.match(/^(.*?)\b(UUID|TEXT|JSONB|TIMESTAMPTZ|BOOLEAN|SMALLINT|INT|BIGSERIAL|REAL|CITEXT|vector)\b/);

    const candidates: { idx: number; kind: string; before: string; token: string }[] = [];
    if (strMatch) candidates.push({ idx: strMatch[1].length, kind: 'string', before: strMatch[1], token: strMatch[2] });
    if (kwMatch)  candidates.push({ idx: kwMatch[1].length,  kind: 'kw',     before: kwMatch[1],  token: kwMatch[2]  });
    if (tyMatch)  candidates.push({ idx: tyMatch[1].length,  kind: 'type',   before: tyMatch[1],  token: tyMatch[2]  });

    if (!candidates.length) { tokens.push({ text: rest, color: '#e8e2d4' }); break; }

    candidates.sort((a, b) => a.idx - b.idx);
    const first = candidates[0];
    if (first.before) tokens.push({ text: first.before, color: '#e8e2d4' });
    tokens.push({
      text: first.token,
      color: first.kind === 'string' ? '#a3c9a8' : first.kind === 'kw' ? '#e2861a' : '#c2b8e0',
    });
    rest = rest.slice(first.before.length + first.token.length);
  }

  return <>{tokens.map((t, i) => <span key={i} style={{ color: t.color }}>{t.text}</span>)}</>;
}

// ── Method badge ────────────────────────────────────────────────
const METHOD_COLORS: Record<string, { bg: string; color: string }> = {
  GET:  { bg: '#E1F5EE', color: '#085041' },
  POST: { bg: '#E6F1FB', color: '#0C447C' },
  WS:   { bg: '#EEEDFE', color: '#3C3489' },
};

// ── Page ────────────────────────────────────────────────────────
export default function ArchitecturePage() {
  const groups: Record<string, typeof API_ROUTES> = {};
  for (const r of API_ROUTES) {
    (groups[r.group] ??= []).push(r);
  }

  return (
    <div style={{ background: bg, color: ink, fontFamily: sans, WebkitFontSmoothing: 'antialiased', minHeight: '100vh' }}>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '56px 28px 120px' }}>

        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingBottom: 32, borderBottom: `0.5px solid ${line}` }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: serif, fontSize: 28, fontWeight: 600, letterSpacing: -0.6 }}>
              Learn<span style={{ fontStyle: 'italic', fontWeight: 400, color: accent }}>scroll</span>
            </span>
          </a>
          <span style={{ fontFamily: mono, fontSize: 11, color: muted, letterSpacing: 0.3, textTransform: 'uppercase' }}>
            architecture · v0 · MIT
          </span>
        </header>

        {/* Title */}
        <h1 style={{ fontFamily: serif, fontSize: 40, fontWeight: 700, letterSpacing: -1, margin: '32px 0 8px', lineHeight: 1.1 }}>
          The shape of the codebase{' '}
          <em style={{ fontWeight: 400, color: muted }}>— optimised for fork, self-host, and donate.</em>
        </h1>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.55, maxWidth: '60ch' }}>
          An open-source product lives or dies by how readable its repo is. Every choice below favours simplicity, single static binaries, and zero vendor lock — so a stranger can{' '}
          <Inline>git clone</Inline>, <Inline>docker compose up</Inline>, and run their own Flint in fifteen minutes.
        </p>

        {/* 01 Stack */}
        <H2 num="01">The stack</H2>
        <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', borderTop: `0.5px solid ${line}` }}>
          {STACK.map((s, i) => (
            <>
              <div key={`l-${i}`} style={{ padding: '11px 0 11px 0', borderBottom: `0.5px solid ${line}`, fontFamily: mono, fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                {s.layer}
              </div>
              <div key={`p-${i}`} style={{ padding: '11px 0', borderBottom: `0.5px solid ${line}`, fontSize: 13.5, lineHeight: 1.5 }}>
                <strong style={{ fontWeight: 600 }}>{s.pick}</strong>
                <span style={{ color: muted, display: 'block', marginTop: 2, fontSize: 12.5 }}>{s.why}</span>
              </div>
            </>
          ))}
        </div>

        {/* 02 Repo layout */}
        <H2 num="02">Repository layout</H2>
        <Lede>
          A single pnpm + Go workspace. <strong>apps/</strong> is what users see, <strong>services/</strong> is what runs in production,{' '}
          <strong>packages/</strong> is shared TS, <strong>db/</strong> is the source of truth, <strong>content/</strong> is the community&apos;s home.
        </Lede>
        <div style={{ background: panel, border: `0.5px solid ${line}`, borderRadius: 14, padding: '14px 16px', fontFamily: mono, fontSize: 12.5, lineHeight: 1.7, overflowX: 'auto' }}>
          <TreeNodeEl node={REPO_TREE} depth={0} />
        </div>

        {/* 03 API surface */}
        <H2 num="03">API surface</H2>
        <Lede>
          Versioned at <Inline>/v1</Inline>. WebSocket only for the live feed; everything else is plain REST + JSON.
          Auth is cookie sessions, not JWTs (simpler to revoke, simpler to self-host).
        </Lede>
        <div style={{ borderTop: `0.5px solid ${line}` }}>
          {Object.keys(groups).map(group => (
            <div key={group}>
              <div style={{ fontFamily: mono, fontSize: 10.5, color: muted, letterSpacing: 0.5, textTransform: 'uppercase', padding: '18px 0 4px' }}>
                {group}
              </div>
              {groups[group].map((r, i) => {
                const mc = METHOD_COLORS[r.method] ?? METHOD_COLORS.GET;
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 2fr', gap: 12, padding: '9px 0', borderBottom: `0.5px solid ${line}`, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: mono, fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: mc.bg, color: mc.color, letterSpacing: 0.3, justifySelf: 'start' }}>
                      {r.method}
                    </span>
                    <span style={{ fontFamily: mono, fontSize: 12.5 }}>{r.path}</span>
                    <span style={{ fontSize: 12, color: muted, lineHeight: 1.5 }}>{r.desc}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* 04 Content pipeline */}
        <H2 num="04">Content pipeline</H2>
        <Lede>
          Raw sources → <Inline>flint ingest</Inline> → moderation worker → <Inline>cards</Inline> table.
          Community PRs land as YAML in <Inline>/content/</Inline> and flow through the same pipeline.
        </Lede>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          {PIPELINE.map(p => (
            <div key={p.step} style={{ background: panel, border: `0.5px solid ${line}`, borderRadius: 12, padding: 12 }}>
              <div style={{ fontFamily: mono, fontSize: 9.5, color: muted, letterSpacing: 0.5, textTransform: 'uppercase' }}>{p.step}</div>
              <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 600, letterSpacing: -0.2, marginTop: 4 }}>{p.name}</div>
              <div style={{ fontSize: 11.5, color: muted, lineHeight: 1.45, marginTop: 6 }}>{p.desc}</div>
            </div>
          ))}
        </div>

        {/* 05 Schema */}
        <H2 num="05">Database schema</H2>
        <Lede>
          Five core tables. <Inline>card_progress</Inline> holds FSRS state per (user, card).{' '}
          <Inline>feed_events</Inline> is the append-only log the ranker reads.
        </Lede>
        <HighlightedSQL sql={SCHEMA} />

        {/* 06 Hosting tiers */}
        <H2 num="06">Hosting tiers</H2>
        <Lede>Targets from the brief, mapped to Hetzner SKUs. Donations cover infra at every tier with room to spare.</Lede>
        <div style={{ display: 'grid', gridTemplateColumns: '130px 80px 1fr', borderTop: `0.5px solid ${line}` }}>
          {SCALING.map((s, i) => (
            <>
              <div key={`t-${i}`} style={{ padding: '11px 0', borderBottom: `0.5px solid ${line}`, fontFamily: mono, fontSize: 12 }}>{s.tier}</div>
              <div key={`c-${i}`} style={{ padding: '11px 0', borderBottom: `0.5px solid ${line}`, fontFamily: mono, fontSize: 13, fontWeight: 600, color: accent }}>{s.monthly}</div>
              <div key={`n-${i}`} style={{ padding: '11px 0', borderBottom: `0.5px solid ${line}`, fontSize: 12.5, color: muted, lineHeight: 1.5 }}>{s.setup}</div>
            </>
          ))}
        </div>

        {/* 07 Non-negotiables */}
        <H2 num="07">Non-negotiables</H2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px', borderTop: `0.5px solid ${line}` }}>
          {[
            { title: 'No vendor lock.',         body: 'Postgres, Redis, R2 (S3-compatible), Cloudflare. All swappable. No Supabase / Firebase / Auth0.' },
            { title: 'One-binary services.',     body: <>Go static binaries. <Inline>docker compose up</Inline> is the whole prod stack.</> },
            { title: 'Local-first SR.',          body: 'Spaced repetition queue lives in on-device SQLite. Server is the catch-up sync, not the source of truth.' },
            { title: 'AI is a worker, not a dependency.', body: <>Strip the <Inline>enrich</Inline> service and the app still runs. Hooks just stay raw.</> },
            { title: 'Community in plain text.', body: <>YAML cards in <Inline>/content</Inline>. Anyone can grep, fork, PR.</> },
            { title: 'Ship the share image.',    body: <>SSR-rendered Open Graph at <Inline>/card/[id]/opengraph-image</Inline>. Free distribution.</> },
          ].map((p, i) => (
            <div key={i} style={{ padding: '12px 0', borderBottom: `0.5px solid ${line}` }}>
              <strong style={{ display: 'block', fontFamily: serif, fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{p.title}</strong>
              <span style={{ color: muted, fontSize: 12.5, lineHeight: 1.5 }}>{p.body}</span>
            </div>
          ))}
        </div>

        {/* 08 What to build first */}
        <H2 num="08">What I&apos;d build first</H2>
        <p style={{ fontSize: 14, color: muted, lineHeight: 1.55 }}>In this order, two-week sprints:</p>
        <ol style={{ margin: '12px 0 0', paddingLeft: 20, fontSize: 14, lineHeight: 1.75 }}>
          {[
            <><strong>Schema + ingest.</strong> Get 1k Tatoeba sentences and 200 Wikipedia leads into Postgres. No app yet.</>,
            <><strong>API skeleton.</strong> <Inline>/v1/feed</Inline> with the simplest mix rule and a hand-tuned ranker. No auth, no AI.</>,
            <><strong>Web client.</strong> Wire the prototype you&apos;ve already approved to the real API.</>,
            <><strong>Auth + progress sync.</strong> Magic link, cookie session, FSRS state.</>,
            <><strong>Enrich worker.</strong> Hook rewriter first — it&apos;s the highest-leverage AI job. Measure dwell time on rewritten vs raw.</>,
            <><strong>Mobile (Expo).</strong> Reuse <Inline>packages/ui</Inline>. Native gesture polish.</>,
            <><strong>Share image SSR.</strong> Once 100 users care.</>,
            <><strong>Community submissions.</strong> When users start asking &quot;how do I add a card?&quot;</>,
          ].map((item, i) => <li key={i}>{item}</li>)}
        </ol>

        {/* Footer */}
        <div style={{ marginTop: 60, paddingTop: 24, borderTop: `0.5px solid ${line}`, display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 11, color: muted }}>
          <span>flint · architecture v0</span>
          <a href="/" style={{ color: muted, textDecoration: 'none' }}>← back to app</a>
        </div>
      </div>
    </div>
  );
}
