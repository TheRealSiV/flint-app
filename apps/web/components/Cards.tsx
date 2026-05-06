'use client';
import { useState } from 'react';
import { AnyCard, CARD_PALETTE } from '@/lib/data';
import Diagram from './Diagram';
import { TypePill, CardShell, CardFooter } from './CardShared';

interface CommonProps { dark: boolean; onShare?: () => void }

// ── Fact ──────────────────────────────────────────────────────
function FactCard({ data, dark, onShare }: CommonProps & { data: Extract<AnyCard, { type: 'fact' }> }) {
  const p = CARD_PALETTE.fact;
  const text = dark ? '#f1ede5' : '#1a1814';
  const muted = dark ? 'rgba(255,255,255,0.65)' : '#5d564b';
  return (
    <CardShell type="fact" dark={dark}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <TypePill type="fact" dark={dark} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35, color: text,
        fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif',
        letterSpacing: -0.1 }}>{data.hook}</div>
      {data.diagram && (
        <div style={{ margin: '10px -2px 6px' }}>
          <Diagram kind={data.diagram} color={dark ? p.bg : p.text} />
        </div>
      )}
      <div style={{ fontSize: 12, lineHeight: 1.6, color: muted, marginTop: 6 }}>{data.context}</div>
      <CardFooter source={data.source} dark={dark} onShare={onShare} />
    </CardShell>
  );
}

// ── Vocab ─────────────────────────────────────────────────────
function VocabCard({ data, dark, onShare }: CommonProps & { data: Extract<AnyCard, { type: 'vocab' }> }) {
  const p = CARD_PALETTE.vocab;
  const text = dark ? '#f1ede5' : p.text;
  const muted = dark ? 'rgba(255,255,255,0.55)' : '#5d4f8d';
  const subBg = dark ? 'rgba(255,255,255,0.05)' : 'rgba(60,52,137,0.06)';
  return (
    <CardShell type="vocab" dark={dark}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <TypePill type="vocab" dark={dark} />
        {data.badge && (
          <span style={{
            fontSize: 9.5, fontWeight: 600, padding: '2px 7px', borderRadius: 999,
            background: data.badge === 'New' ? '#1a8654' : '#E2861A',
            color: '#fff', letterSpacing: 0.4, textTransform: 'uppercase',
            fontFamily: '"SF Mono", ui-monospace, monospace',
          }}>{data.badge}</span>
        )}
      </div>
      <div style={{ textAlign: 'center', padding: '6px 0 4px' }}>
        <div style={{ fontSize: 11, color: muted, letterSpacing: 0.5, fontFamily: '"Noto Sans JP", "Hiragino Sans", sans-serif' }}>{data.reading}</div>
        <div style={{ fontSize: 46, fontWeight: 500, color: text, lineHeight: 1.1, marginTop: 2,
          fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", serif', letterSpacing: 1 }}>{data.word}</div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <button onClick={(e) => e.stopPropagation()} style={{
            all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 26, height: 26, borderRadius: 99,
            background: dark ? 'rgba(255,255,255,0.1)' : '#fff', color: text,
            border: `0.5px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(60,52,137,0.15)'}`,
          }}>
            <svg width="9" height="11" viewBox="0 0 9 11" fill="currentColor"><path d="M0 0v11l9-5.5z"/></svg>
          </button>
          <span style={{ fontSize: 12, color: muted, fontFamily: '"SF Mono", ui-monospace, monospace' }}>{data.pitch}</span>
        </div>
      </div>
      <div style={{ fontSize: 13.5, color: text, fontWeight: 500, marginTop: 8, textAlign: 'center' }}>{data.meaning}</div>
      <div style={{ fontSize: 10.5, color: muted, textAlign: 'center', marginTop: 2, fontStyle: 'italic' }}>
        {data.pos} · {data.level}
      </div>
      {data.example && (
        <div style={{ marginTop: 10, padding: '8px 10px', background: subBg, borderRadius: 10 }}>
          <div style={{ fontSize: 13, color: text, lineHeight: 1.5, fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", serif' }}>{data.example}</div>
          <div style={{ fontSize: 11, color: muted, fontStyle: 'italic', marginTop: 3 }}>{data.exampleTl}</div>
        </div>
      )}
      <CardFooter source="Tatoeba · Core 6000" dark={dark} onShare={onShare} />
    </CardShell>
  );
}

// ── Sentence ──────────────────────────────────────────────────
function SentenceCard({ data, dark, onShare }: CommonProps & { data: Extract<AnyCard, { type: 'sentence' }> }) {
  const p = CARD_PALETTE.sentence;
  const text = dark ? '#f1ede5' : '#1a1814';
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#7a4030';
  const accent = dark ? '#f1ede5' : p.text;
  const [known, setKnown] = useState<Record<string, boolean>>({});

  const parts: { text: string; kind: 'plain' | 'unknown' }[] = [];
  const re = /\[([^\]]+)\]/g; let last = 0; let m;
  while ((m = re.exec(data.sentence)) !== null) {
    if (m.index > last) parts.push({ text: data.sentence.slice(last, m.index), kind: 'plain' });
    parts.push({ text: m[1], kind: 'unknown' });
    last = m.index + m[0].length;
  }
  if (last < data.sentence.length) parts.push({ text: data.sentence.slice(last), kind: 'plain' });

  return (
    <CardShell type="sentence" dark={dark}>
      <div style={{ marginBottom: 8 }}><TypePill type="sentence" dark={dark} /></div>
      <div style={{ fontSize: 19, lineHeight: 1.65, color: text, padding: '6px 2px 8px',
        fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", serif' }}>
        {parts.map((part, i) => part.kind === 'unknown' ? (
          <button key={i} onClick={(e) => { e.stopPropagation(); setKnown(k => ({ ...k, [part.text]: !k[part.text] })); }} style={{
            all: 'unset', cursor: 'pointer',
            color: known[part.text] ? muted : accent,
            textDecoration: known[part.text] ? 'line-through' : 'underline',
            textDecorationStyle: 'solid', textDecorationThickness: '1.5px', textUnderlineOffset: '4px',
            fontWeight: known[part.text] ? 400 : 600,
          }}>{part.text}</button>
        ) : <span key={i}>{part.text}</span>)}
      </div>
      <div style={{ fontSize: 12, color: muted, fontStyle: 'italic', marginTop: 2 }}>{data.translation}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
        {data.unknown.map((u, i) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'baseline', gap: 5,
            padding: '4px 9px', borderRadius: 999,
            background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)',
            border: `0.5px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(113,43,19,0.12)'}`,
            fontSize: 11.5,
          }}>
            <span style={{ color: accent, fontWeight: 600, fontFamily: '"Noto Serif JP", serif' }}>{u.word}</span>
            <span style={{ color: muted, fontFamily: '"SF Mono", ui-monospace, monospace', fontSize: 10 }}>{u.reading}</span>
            <span style={{ color: text }}>· {u.meaning}</span>
          </span>
        ))}
      </div>
      <div style={{ fontSize: 10, color: muted, marginTop: 8,
        fontFamily: '"SF Mono", ui-monospace, monospace', letterSpacing: 0.1 }}>tap underlined words to mark known</div>
      <CardFooter source={data.source} dark={dark} onShare={onShare} />
    </CardShell>
  );
}

// ── Quiz ──────────────────────────────────────────────────────
function QuizCard({ data, dark, onShare }: CommonProps & { data: Extract<AnyCard, { type: 'quiz' }> }) {
  const text = dark ? '#f1ede5' : '#1a1814';
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#3a5d8d';
  const [picked, setPicked] = useState<number | null>(null);
  const reveal = picked !== null;

  return (
    <CardShell type="quiz" dark={dark}>
      <div style={{ marginBottom: 8 }}><TypePill type="quiz" dark={dark} /></div>
      <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, color: text,
        fontFamily: '"Source Serif 4", Georgia, serif' }}>{data.question}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
        {data.options.map((opt, i) => {
          const isCorrect = i === data.correct;
          const isPicked = i === picked;
          let bg = dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.65)';
          let border = dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(12,68,124,0.12)';
          let color = text;
          if (reveal) {
            if (isCorrect) { bg = '#c8e8d3'; border = '0.5px solid #1a8654'; color = '#0c4d2a'; }
            else if (isPicked) { bg = '#f3d2d2'; border = '0.5px solid #c43a3a'; color = '#7a1f1f'; }
          }
          return (
            <button key={i} onClick={(e) => { e.stopPropagation(); if (picked === null) setPicked(i); }}
              disabled={reveal} style={{
                all: 'unset', cursor: reveal ? 'default' : 'pointer',
                padding: '9px 11px', borderRadius: 10, background: bg, border, color,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                fontSize: 13, fontWeight: 500,
              }}>
              <span>{opt}</span>
              {reveal && isCorrect && <span>✓</span>}
              {reveal && !isCorrect && isPicked && <span>✕</span>}
            </button>
          );
        })}
      </div>
      {reveal && (
        <div style={{
          marginTop: 10, padding: '9px 11px', borderRadius: 10,
          background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)',
          fontSize: 12, lineHeight: 1.55, color: muted,
        }}>
          <span style={{ fontWeight: 600, color: text, fontFamily: '"SF Mono", ui-monospace, monospace',
            fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase' }}>Why · </span>
          {data.explanation}
        </div>
      )}
      <CardFooter source={data.source} dark={dark} onShare={onShare} />
    </CardShell>
  );
}

// ── Concept ───────────────────────────────────────────────────
function ConceptCard({ data, dark, onDeeper, onShare }: CommonProps & { data: Extract<AnyCard, { type: 'concept' }>; onDeeper?: () => void }) {
  const p = CARD_PALETTE.concept;
  const text = dark ? '#f1ede5' : '#1a1814';
  const muted = dark ? 'rgba(255,255,255,0.65)' : '#7a5a2a';
  return (
    <CardShell type="concept" dark={dark}>
      <div style={{ marginBottom: 8 }}><TypePill type="concept" dark={dark} /></div>
      <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35, color: text,
        fontFamily: '"Source Serif 4", Georgia, serif', letterSpacing: -0.1 }}>{data.hook}</div>
      {data.diagram && (
        <div style={{ margin: '12px -2px 6px' }}>
          <Diagram kind={data.diagram} color={dark ? p.bg : p.text} />
        </div>
      )}
      <div style={{ fontSize: 12, lineHeight: 1.6, color: muted, marginTop: 6 }}>{data.context}</div>
      {onDeeper && (
        <button onClick={(e) => { e.stopPropagation(); onDeeper(); }} style={{
          all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
          marginTop: 10, padding: '5px 10px 5px 11px', borderRadius: 999,
          background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(99,56,6,0.1)',
          color: dark ? p.bg : p.text, fontSize: 11.5, fontWeight: 600,
          fontFamily: '"SF Mono", ui-monospace, monospace', letterSpacing: 0.3,
        }}>go deeper →</button>
      )}
      <CardFooter source={data.source} dark={dark} onShare={onShare} />
    </CardShell>
  );
}

// ── Dispatcher ────────────────────────────────────────────────
interface FeedCardProps {
  data: AnyCard; dark: boolean;
  onDeeper?: (threadId: string) => void;
  onShare?: (card: AnyCard) => void;
}

export default function FeedCard({ data, dark, onDeeper, onShare }: FeedCardProps) {
  const share = () => onShare?.(data);
  if (data.type === 'fact')     return <FactCard     data={data} dark={dark} onShare={share} />;
  if (data.type === 'vocab')    return <VocabCard    data={data} dark={dark} onShare={share} />;
  if (data.type === 'sentence') return <SentenceCard data={data} dark={dark} onShare={share} />;
  if (data.type === 'quiz')     return <QuizCard     data={data} dark={dark} onShare={share} />;
  if (data.type === 'concept')  return (
    <ConceptCard
      data={data} dark={dark} onShare={share}
      onDeeper={data.deeper && onDeeper ? () => onDeeper(data.deeper!) : undefined}
    />
  );
  return null;
}
