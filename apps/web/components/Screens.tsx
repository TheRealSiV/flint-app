'use client';
import { useState, useEffect } from 'react';
import { FEED_CARDS, THREADS, TOPICS, AnyCard } from '@/lib/data';
import FeedCard from './Cards';

const SCREEN_BG = { light: '#FAF7F1', dark: '#0F0E0C' };
const TEXT      = { light: '#1a1814', dark: '#f1ede5' };
const MUTED     = { light: '#7a766f', dark: 'rgba(255,255,255,0.55)' };
const BORDER    = { light: 'rgba(60,60,67,0.10)', dark: 'rgba(255,255,255,0.08)' };

// ── Feed header ───────────────────────────────────────────────
function FeedHeader({ dark, tab, setTab, streak }: { dark: boolean; tab: string; setTab: (t: string) => void; streak: number }) {
  const text = dark ? TEXT.dark : TEXT.light;
  const muted = dark ? MUTED.dark : MUTED.light;
  const bg = dark ? SCREEN_BG.dark : SCREEN_BG.light;
  const tabs = ['For You', 'Topics', 'Language', 'Saved'];
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 5,
      background: bg + 'f0',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: `0.5px solid ${dark ? BORDER.dark : BORDER.light}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px 6px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{ fontFamily: '"Source Serif 4", Georgia, serif', fontSize: 22, fontWeight: 600, color: text, letterSpacing: -0.4 }}>Learn</span>
          <span style={{ fontFamily: '"Source Serif 4", Georgia, serif', fontSize: 22, fontWeight: 400, fontStyle: 'italic', color: '#E2861A', letterSpacing: -0.4 }}>scroll</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 10px 4px 8px', borderRadius: 999,
            background: dark ? 'rgba(226,134,26,0.15)' : 'rgba(226,134,26,0.12)',
            color: '#E2861A', fontSize: 12, fontWeight: 600,
            fontFamily: '"SF Mono", ui-monospace, monospace',
          }}>
            <span style={{ fontSize: 13 }}>✦</span>{streak}
          </div>
          <button style={{ all: 'unset', cursor: 'pointer', padding: 4, color: muted }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="8" r="5.5"/><path d="M16 16l-3.5-3.5"/>
            </svg>
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, padding: '4px 12px 8px', overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            all: 'unset', cursor: 'pointer', padding: '6px 12px', borderRadius: 999,
            background: tab === t ? (dark ? '#fff' : '#1a1814') : 'transparent',
            color: tab === t ? (dark ? '#1a1814' : '#fff') : muted,
            fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
          }}>{t}</button>
        ))}
      </div>
    </div>
  );
}

function FriendsStrip({ dark }: { dark: boolean }) {
  const muted = dark ? MUTED.dark : MUTED.light;
  const text  = dark ? TEXT.dark  : TEXT.light;
  return (
    <div style={{
      margin: '0 10px 10px', padding: '9px 12px', borderRadius: 14,
      background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.55)',
      border: `0.5px solid ${dark ? BORDER.dark : BORDER.light}`,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{ display: 'flex' }}>
        {(['A','K','M'] as string[]).map((l, i) => (
          <div key={i} style={{
            width: 22, height: 22, borderRadius: 99,
            background: ['#E2861A','#3C3489','#085041'][i],
            color: '#fff', fontSize: 10, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginLeft: i ? -6 : 0, border: `1.5px solid ${dark ? '#0F0E0C' : '#FAF7F1'}`,
          }}>{l}</div>
        ))}
      </div>
      <div style={{ fontSize: 11.5, color: muted, lineHeight: 1.4, flex: 1 }}>
        <span style={{ color: text, fontWeight: 500 }}>Ana</span> learned{' '}
        <span style={{ fontFamily: '"Noto Serif JP", serif', color: text }}>走る</span>{' · '}
        <span style={{ color: text, fontWeight: 500 }}>Kenji</span> finished a thread
      </div>
      <span style={{ fontSize: 10, color: muted, fontFamily: '"SF Mono", monospace' }}>2m</span>
    </div>
  );
}

// ── Feed screen ───────────────────────────────────────────────

function apiCardToAnyCard(c: Record<string, unknown>): AnyCard {
  const base = { id: c.id as string, tags: (c.tags as string[]) ?? [] };
  const type = c.type as string;
  if (type === 'vocab') {
    return { ...base, type: 'vocab', word: c.front as string, reading: '', meaning: (c.back as string) ?? '', pos: '', pitch: '', level: '', example: (c.context as string) ?? '', exampleTl: '' };
  }
  if (type === 'quiz') {
    return { ...base, type: 'quiz', question: c.front as string, options: [], correct: 0, explanation: (c.context as string) ?? '', source: (c.source as string) ?? '' };
  }
  if (type === 'sentence') {
    return { ...base, type: 'sentence', sentence: c.front as string, sentencePlain: c.front as string, translation: (c.back as string) ?? '', unknown: [], source: (c.source as string) ?? '' };
  }
  if (type === 'concept') {
    return { ...base, type: 'concept', hook: c.front as string, context: (c.context as string) ?? '', source: (c.source as string) ?? '' };
  }
  return { ...base, type: 'fact', hook: c.front as string, context: (c.context as string) ?? '', source: (c.source as string) ?? '' };
}

export function FeedScreen({ dark, onDeeper, onShare, streak }: {
  dark: boolean; streak: number;
  onDeeper: (threadId: string) => void;
  onShare: (card: AnyCard) => void;
}) {
  const [tab, setTab] = useState('For You');
  const [cards, setCards] = useState<AnyCard[]>(FEED_CARDS);
  const [loading, setLoading] = useState(false);
  const muted = dark ? MUTED.dark : MUTED.light;

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;
    setLoading(true);
    fetch(`${apiUrl}/v1/feed`)
      .then(r => r.json())
      .then((data: { cards: Record<string, unknown>[] }) => {
        if (data.cards?.length > 0) {
          setCards(data.cards.map(apiCardToAnyCard));
        }
      })
      .catch(() => { /* keep mock data on error */ })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <FeedHeader dark={dark} tab={tab} setTab={setTab} streak={streak} />
      <FriendsStrip dark={dark} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 10px 100px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: muted, fontSize: 11, fontFamily: '"SF Mono", monospace' }}>
            loading feed…
          </div>
        )}
        {cards.map(c => (
          <FeedCard key={c.id} data={c} dark={dark} onDeeper={onDeeper} onShare={onShare} />
        ))}
        <div style={{ textAlign: 'center', padding: '20px 0', color: muted, fontSize: 11, fontFamily: '"SF Mono", monospace' }}>
          buffering 20 more cards · pre-fetched
        </div>
      </div>
    </div>
  );
}

// ── Topics screen ─────────────────────────────────────────────
export function TopicsScreen({ dark }: { dark: boolean }) {
  const text  = dark ? TEXT.dark  : TEXT.light;
  const muted = dark ? MUTED.dark : MUTED.light;
  return (
    <div style={{ padding: '8px 10px 100px' }}>
      <div style={{ padding: '14px 6px 18px' }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: text,
          fontFamily: '"Source Serif 4", Georgia, serif', letterSpacing: -0.6 }}>Topics</div>
        <div style={{ fontSize: 12.5, color: muted, marginTop: 3 }}>Browse by subject. Tap to add to your feed.</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
        {TOPICS.map(t => (
          <div key={t.name} style={{
            background: dark ? '#1c1a17' : t.bg, borderRadius: 14, padding: '14px 12px 12px',
            border: `0.5px solid ${dark ? BORDER.dark : 'rgba(0,0,0,0.04)'}`,
            minHeight: 96, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer',
          }}>
            <div style={{ fontSize: 28, lineHeight: 1, color: dark ? t.bg : t.color,
              fontFamily: '"Source Serif 4", Georgia, serif' }}>{t.icon}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: dark ? t.bg : t.color }}>{t.name}</div>
              <div style={{ fontSize: 10.5, color: dark ? t.bg + 'aa' : t.color + 'aa', marginTop: 2,
                fontFamily: '"SF Mono", monospace' }}>{t.count.toLocaleString()} cards</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Progress screen ───────────────────────────────────────────
function ProgressRing({ percent, color, size = 54 }: { percent: number; color: string; size?: number }) {
  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      <circle cx={size/2} cy={size/2} r={r} stroke={color+'22'} strokeWidth="4" fill="none"/>
      <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth="4" fill="none"
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c*(1-percent)}
        transform={`rotate(-90 ${size/2} ${size/2})`}/>
    </svg>
  );
}

export function ProgressScreen({ dark, streak }: { dark: boolean; streak: number }) {
  const text    = dark ? TEXT.dark    : TEXT.light;
  const muted   = dark ? MUTED.dark   : MUTED.light;
  const cardBg  = dark ? '#1c1a17'    : '#fff';
  const border  = dark ? BORDER.dark  : BORDER.light;

  const topicProgress = [
    { name: 'Japanese (N4)',  pct: 0.62, color: '#3C3489' },
    { name: 'Biology',        pct: 0.38, color: '#085041' },
    { name: 'World History',  pct: 0.71, color: '#633806' },
    { name: 'Astronomy',      pct: 0.18, color: '#0C447C' },
  ];

  return (
    <div style={{ padding: '8px 10px 100px' }}>
      <div style={{ padding: '14px 6px 14px' }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: text,
          fontFamily: '"Source Serif 4", Georgia, serif', letterSpacing: -0.6 }}>Progress</div>
        <div style={{ fontSize: 12.5, color: muted, marginTop: 3 }}>Today, this week, all time.</div>
      </div>

      {/* Streak + daily ring */}
      <div style={{ background: cardBg, borderRadius: 16, padding: 14, border: `0.5px solid ${border}`,
        display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ position: 'relative', width: 54, height: 54 }}>
          <ProgressRing percent={0.7} color="#E2861A" />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: text, fontFamily: '"SF Mono", monospace' }}>7/10</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: text }}>Daily goal</div>
          <div style={{ fontSize: 11.5, color: muted, marginTop: 2 }}>3 more cards to hit today&apos;s target</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#E2861A',
            fontFamily: '"Source Serif 4", Georgia, serif' }}>✦ {streak}</div>
          <div style={{ fontSize: 10, color: muted, fontFamily: '"SF Mono", monospace' }}>day streak</div>
        </div>
      </div>

      <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 10,
        background: dark ? 'rgba(226,134,26,0.1)' : 'rgba(226,134,26,0.08)',
        fontSize: 11, color: dark ? '#E2861A' : '#a86510',
        fontFamily: '"SF Mono", monospace', letterSpacing: 0.1 }}>
        ★ shield available · 1 of 1 this week
      </div>

      {/* Due for review */}
      <div style={{ marginTop: 18, marginBottom: 8, padding: '0 6px',
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: text, fontFamily: '"SF Mono", monospace',
          letterSpacing: 0.3, textTransform: 'uppercase' }}>Due for review</div>
        <button style={{ all: 'unset', cursor: 'pointer', fontSize: 12, color: '#3C3489', fontWeight: 500 }}>start →</button>
      </div>
      <div style={{ background: cardBg, borderRadius: 16, padding: 14, border: `0.5px solid ${border}`,
        display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex' }}>
          {['橋','黄昏','勿体','走る','綺麗'].map((c, i) => (
            <div key={i} style={{
              width: 36, height: 36, borderRadius: 9,
              background: dark ? 'rgba(60,52,137,0.3)' : '#EEEDFE',
              color: dark ? '#EEEDFE' : '#3C3489',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontFamily: '"Noto Serif JP", serif', fontWeight: 500,
              marginLeft: i ? -8 : 0, border: `1.5px solid ${cardBg}`,
            }}>{c}</div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: text }}>23 vocab cards</div>
          <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>~6 min · spaced repetition queue</div>
        </div>
      </div>

      {/* Topic bars */}
      <div style={{ marginTop: 18, marginBottom: 8, padding: '0 6px', fontSize: 13, fontWeight: 600,
        color: text, fontFamily: '"SF Mono", monospace', letterSpacing: 0.3, textTransform: 'uppercase' }}>Topics</div>
      <div style={{ background: cardBg, borderRadius: 16, padding: '6px 14px', border: `0.5px solid ${border}` }}>
        {topicProgress.map((t, i) => (
          <div key={t.name} style={{ padding: '12px 0', borderTop: i ? `0.5px solid ${border}` : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: 12.5, color: text, fontWeight: 500 }}>{t.name}</span>
              <span style={{ fontSize: 11, color: muted, fontFamily: '"SF Mono", monospace' }}>{Math.round(t.pct*100)}%</span>
            </div>
            <div style={{ height: 4, borderRadius: 999, background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}>
              <div style={{ width: `${t.pct*100}%`, height: '100%', borderRadius: 999, background: t.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12 }}>
        {[
          { v: '847', l: 'cards seen',    c: text },
          { v: '312', l: 'words known',   c: '#3C3489' },
          { v: '91%', l: 'quiz accuracy', c: '#085041' },
        ].map(s => (
          <div key={s.l} style={{ background: cardBg, borderRadius: 12, padding: '10px 12px', border: `0.5px solid ${border}` }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: s.c,
              fontFamily: '"Source Serif 4", Georgia, serif' }}>{s.v}</div>
            <div style={{ fontSize: 10, color: muted, marginTop: 2, fontFamily: '"SF Mono", monospace', letterSpacing: 0.1 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Profile screen ────────────────────────────────────────────
export function ProfileScreen({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  const text   = dark ? TEXT.dark   : TEXT.light;
  const muted  = dark ? MUTED.dark  : MUTED.light;
  const cardBg = dark ? '#1c1a17'   : '#fff';
  const border = dark ? BORDER.dark : BORDER.light;

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontSize: 11, color: muted, padding: '0 16px 6px',
        fontFamily: '"SF Mono", monospace', letterSpacing: 0.5, textTransform: 'uppercase' }}>{title}</div>
      <div style={{ background: cardBg, borderRadius: 14, border: `0.5px solid ${border}`, overflow: 'hidden' }}>{children}</div>
    </div>
  );

  const Row = ({ label, detail, last, control }: { label: string; detail?: string; last?: boolean; control?: React.ReactNode }) => (
    <div style={{ display: 'flex', alignItems: 'center', minHeight: 44, padding: '10px 14px',
      borderBottom: last ? 'none' : `0.5px solid ${border}` }}>
      <div style={{ flex: 1, fontSize: 13.5, color: text }}>{label}</div>
      {detail && <span style={{ fontSize: 12, color: muted, fontFamily: '"SF Mono", monospace', marginRight: control ? 8 : 0 }}>{detail}</span>}
      {control}
      {!control && <svg width="6" height="11" viewBox="0 0 6 11"><path d="M1 1l4 4.5L1 10" stroke={muted} strokeWidth="1.4" fill="none" strokeLinecap="round"/></svg>}
    </div>
  );

  const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button onClick={onClick} style={{
      all: 'unset', cursor: 'pointer', width: 40, height: 24, borderRadius: 999,
      background: on ? '#3C3489' : (dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'),
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 2, left: on ? 18 : 2,
        width: 20, height: 20, borderRadius: 99, background: '#fff',
        transition: 'left 120ms', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );

  return (
    <div style={{ padding: '8px 10px 100px' }}>
      <div style={{ padding: '14px 6px 14px' }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: text,
          fontFamily: '"Source Serif 4", Georgia, serif', letterSpacing: -0.6 }}>Profile</div>
      </div>

      <div style={{ background: cardBg, borderRadius: 16, padding: '16px 14px', border: `0.5px solid ${border}`,
        display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 50, height: 50, borderRadius: 99,
          background: 'linear-gradient(135deg, #E2861A, #712B13)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 19, fontWeight: 700, fontFamily: '"Source Serif 4", Georgia, serif',
        }}>R</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: text }}>Riley · @riley</div>
          <div style={{ fontSize: 11.5, color: muted, marginTop: 2,
            fontFamily: '"SF Mono", monospace' }}>joined 3 months ago · 312 words</div>
        </div>
      </div>

      <Section title="Learning">
        <Row label="Language goal" detail="Japanese · N4" />
        <Row label="Daily target"  detail="10 cards" />
        <Row label="Topics"        detail="6 active" />
        <Row label="Anki decks"    detail="Core 6000 + 2 more" last />
      </Section>
      <Section title="Feed">
        <Row label="Mix ratio"     detail="35 / 30 / 20 / 15" />
        <Row label="Card types"    detail="all 6" />
        <Row label="Audio playback" detail="auto" last />
      </Section>
      <Section title="Appearance">
        <Row label="Dark mode" control={<Toggle on={dark} onClick={() => setDark(!dark)} />} last />
      </Section>
      <Section title="Open source">
        <Row label="GitHub"        detail="flint-app/app" />
        <Row label="Self-host guide" />
        <Row label="Donate"        detail="❤︎" last />
      </Section>

      <div style={{ textAlign: 'center', padding: '24px 12px 0', color: muted,
        fontSize: 10.5, lineHeight: 1.6, fontFamily: '"SF Mono", monospace' }}>
        v1.0.0-rc1 · MIT licensed<br/>
        no ads · no paywalls · no dark patterns
      </div>
    </div>
  );
}

// ── Rabbit hole screen ────────────────────────────────────────
export function RabbitHoleScreen({ threadId, dark, onBack, onShare }: {
  threadId: string; dark: boolean;
  onBack: () => void; onShare: (card: AnyCard) => void;
}) {
  const thread = THREADS[threadId];
  const text  = dark ? TEXT.dark  : TEXT.light;
  const muted = dark ? MUTED.dark : MUTED.light;
  if (!thread) return null;

  return (
    <div style={{ background: dark ? '#171411' : '#F1EFE8', minHeight: '100%' }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 5,
        background: (dark ? '#171411' : '#F1EFE8') + 'ee',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `0.5px solid ${dark ? BORDER.dark : 'rgba(68,68,65,0.15)'}`,
        padding: '10px 12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onBack} style={{ all: 'unset', cursor: 'pointer', padding: 4, color: dark ? '#fff' : '#444441' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 3l-5 5 5 5"/>
            </svg>
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9.5, color: muted, fontFamily: '"SF Mono", monospace',
              letterSpacing: 0.6, textTransform: 'uppercase' }}>Thread</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: text,
              fontFamily: '"Source Serif 4", Georgia, serif', letterSpacing: -0.2 }}>{thread.name}</div>
          </div>
          <span style={{
            fontSize: 10.5, color: muted, fontFamily: '"SF Mono", monospace',
            padding: '4px 9px', borderRadius: 999,
            background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(68,68,65,0.06)',
          }}>{thread.cards.length} cards</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '10px 10px 100px' }}>
        {thread.cards.map(c => (
          <FeedCard key={c.id} data={c} dark={dark} onShare={onShare} />
        ))}
        <div style={{ textAlign: 'center', padding: '16px', color: muted, fontSize: 11, fontFamily: '"SF Mono", monospace' }}>
          end of thread · ← back to feed
        </div>
      </div>
    </div>
  );
}
