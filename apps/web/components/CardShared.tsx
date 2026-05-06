'use client';
import { useState } from 'react';
import { CARD_PALETTE } from '@/lib/data';

export function TypePill({ type, dark }: { type: string; dark: boolean }) {
  const p = CARD_PALETTE[type] ?? CARD_PALETTE.fact;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: dark ? p.text + '33' : p.bg, color: dark ? p.bg : p.text,
      padding: '3px 9px', borderRadius: 999, fontSize: 10.5,
      fontWeight: 600, letterSpacing: 0.2, textTransform: 'uppercase',
      fontFamily: '"SF Mono", ui-monospace, Menlo, monospace',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 99, background: dark ? p.bg : p.text }} />
      {p.label}
    </span>
  );
}

interface ReactionsProps { dark: boolean; onDeeper?: () => void }
export function Reactions({ dark, onDeeper }: ReactionsProps) {
  const [state, setState] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setState(s => ({ ...s, [k]: !s[k] }));
  const muted = dark ? 'rgba(255,255,255,0.55)' : '#7a766f';
  const active = dark ? '#fff' : '#1a1814';

  const btn = (k: string, glyph: string, label: string) => (
    <button onClick={(e) => { e.stopPropagation(); toggle(k); }} key={k} style={{
      all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '6px 10px', borderRadius: 999,
      background: state[k] ? (dark ? 'rgba(255,255,255,0.08)' : '#0000000a') : 'transparent',
      color: state[k] ? active : muted, fontSize: 12, fontWeight: 500,
    }}>
      <span style={{ fontSize: 13 }}>{glyph}</span>
      <span style={{ fontSize: 11.5 }}>{label}</span>
    </button>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      {btn('love', '♡', 'Love')}
      {btn('blown', '⚡', 'Mind blown')}
      {btn('knew', '✓', 'Knew')}
      {onDeeper && (
        <button onClick={(e) => { e.stopPropagation(); onDeeper(); }} style={{
          all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '6px 10px', borderRadius: 999, color: muted, fontSize: 11.5, fontWeight: 500,
        }}>
          <span>→</span><span>Want more</span>
        </button>
      )}
    </div>
  );
}

interface CardFooterProps {
  source?: string; dark: boolean;
  onDeeper?: () => void; onShare?: () => void;
}
export function CardFooter({ source, dark, onDeeper, onShare }: CardFooterProps) {
  const muted = dark ? 'rgba(255,255,255,0.5)' : 'rgba(60,60,67,0.55)';
  const [saved, setSaved] = useState(false);
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 9, marginTop: 9,
        borderTop: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.06)',
      }}>
        <Reactions dark={dark} onDeeper={onDeeper} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button onClick={(e) => { e.stopPropagation(); setSaved(s => !s); }} style={{
            all: 'unset', cursor: 'pointer', padding: 6,
            color: saved ? (dark ? '#fff' : '#1a1814') : muted, fontSize: 14,
          }}>
            <svg width="14" height="16" viewBox="0 0 14 16" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
              <path d="M2 1.5h10v13l-5-3.5-5 3.5z"/>
            </svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); onShare?.(); }} style={{
            all: 'unset', cursor: 'pointer', padding: 6, color: muted, fontSize: 14,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 1v9M3.5 4.5L7 1l3.5 3.5M2 9v3.5h10V9"/>
            </svg>
          </button>
        </div>
      </div>
      {source && (
        <div style={{
          fontSize: 10, color: muted, fontFamily: '"SF Mono", ui-monospace, Menlo, monospace',
          marginTop: 6, letterSpacing: 0.1,
        }}>{source}</div>
      )}
    </div>
  );
}

interface CardShellProps {
  type: string; dark: boolean; children: React.ReactNode;
  onClick?: () => void; style?: React.CSSProperties;
}
export function CardShell({ type, dark, children, onClick, style = {} }: CardShellProps) {
  const p = CARD_PALETTE[type] ?? CARD_PALETTE.fact;
  return (
    <div onClick={onClick} style={{
      background: dark ? '#1c1a17' : p.bg,
      borderRadius: 16, padding: '12px 12px 10px',
      border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.06)',
      cursor: onClick ? 'pointer' : 'default',
      position: 'relative', ...style,
    }}>
      {children}
    </div>
  );
}
