'use client';
import { useState } from 'react';
import { AnyCard, CARD_PALETTE, FEED_CARDS } from '@/lib/data';

type Tab = 'feed' | 'topics' | 'progress' | 'profile';

interface BottomNavProps { active: Tab; setActive: (t: Tab) => void; dark: boolean }

export function BottomNav({ active, setActive, dark }: BottomNavProps) {
  const muted = dark ? 'rgba(255,255,255,0.45)' : '#9c968d';
  const text  = dark ? '#fff' : '#1a1814';
  const bg    = dark ? '#0F0E0C' : '#FAF7F1';

  const items: { id: Tab; label: string; icon: (s: string) => React.ReactNode }[] = [
    {
      id: 'feed', label: 'Feed',
      icon: s => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={s} strokeWidth="1.6"><path d="M3 4h14M3 9h14M3 14h9"/></svg>,
    },
    {
      id: 'topics', label: 'Topics',
      icon: s => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={s} strokeWidth="1.6"><rect x="3" y="3" width="6" height="6" rx="1.2"/><rect x="11" y="3" width="6" height="6" rx="1.2"/><rect x="3" y="11" width="6" height="6" rx="1.2"/><rect x="11" y="11" width="6" height="6" rx="1.2"/></svg>,
    },
    {
      id: 'progress', label: 'Progress',
      icon: s => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={s} strokeWidth="1.6"><path d="M3 16V8M8 16V4M13 16v-7M18 16v-3"/></svg>,
    },
    {
      id: 'profile', label: 'Profile',
      icon: s => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={s} strokeWidth="1.6"><circle cx="10" cy="7" r="3.2"/><path d="M3.5 17c1.2-3.5 4-5.2 6.5-5.2s5.3 1.7 6.5 5.2"/></svg>,
    },
  ];

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
      paddingBottom: 'env(safe-area-inset-bottom, 16px)',
      background: bg + 'f0',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderTop: `0.5px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(60,60,67,0.10)'}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '8px 12px 4px' }}>
        {items.map(it => {
          const on = active === it.id;
          return (
            <button key={it.id} onClick={() => setActive(it.id)} style={{
              all: 'unset', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '4px 10px', minWidth: 56, color: on ? text : muted,
            }}>
              {it.icon(on ? text : muted)}
              <span style={{ fontSize: 10, fontWeight: on ? 600 : 500,
                fontFamily: '"SF Mono", ui-monospace, monospace', letterSpacing: 0.2 }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Share sheet ────────────────────────────────────────────────
function ShareCardPreview({ data, ratio }: { data: AnyCard; ratio: string }) {
  const p = CARD_PALETTE[data.type] ?? { bg: '#FAF7F1', text: '#1a1814', label: 'Card' };
  const dims = ratio === '9:16' ? { w: 158, h: 280 } : ratio === '1:1' ? { w: 220, h: 220 } : { w: 280, h: 158 };
  const hookSize = ratio === '9:16' ? 16 : 17;
  const hook = ('hook' in data ? data.hook : null) ?? ('word' in data ? data.word : null) ?? ('question' in data ? data.question : null) ?? ('sentencePlain' in data ? data.sentencePlain : null) ?? 'LearnScroll';

  return (
    <div style={{
      width: dims.w, height: dims.h, borderRadius: 14, overflow: 'hidden', background: p.bg,
      flexShrink: 0, boxShadow: '0 6px 20px rgba(0,0,0,0.10)', border: '0.5px solid rgba(0,0,0,0.05)',
      display: 'flex', flexDirection: 'column', padding: 14,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
          padding: '3px 8px', borderRadius: 999, background: p.text, color: p.bg,
          fontFamily: '"SF Mono", monospace',
        }}>{p.label}</span>
        <span style={{ fontSize: 9, color: p.text + '99', fontFamily: '"SF Mono", monospace', letterSpacing: 0.3 }}>{ratio}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0' }}>
        <div style={{
          fontSize: data.type === 'vocab' ? 36 : hookSize,
          fontWeight: 600, color: p.text,
          fontFamily: data.type === 'vocab' ? '"Noto Serif JP", serif' : '"Source Serif 4", Georgia, serif',
          textAlign: 'center', lineHeight: 1.3, letterSpacing: -0.2,
        }}>{hook}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        fontSize: 9, color: p.text + '99', fontFamily: '"SF Mono", monospace' }}>
        <span>{'source' in data ? data.source : 'LearnScroll'}</span>
        <span style={{ fontStyle: 'italic', fontFamily: '"Source Serif 4", serif' }}>
          via Learn<span style={{ color: '#E2861A' }}>scroll</span>
        </span>
      </div>
    </div>
  );
}

export function ShareSheet({ card, dark, onClose }: { card: AnyCard; dark: boolean; onClose: () => void }) {
  const [ratio, setRatio] = useState('1:1');
  const text    = dark ? '#f1ede5' : '#1a1814';
  const muted   = dark ? 'rgba(255,255,255,0.55)' : '#7a766f';
  const sheetBg = dark ? '#1c1a17' : '#fff';

  const ratios = [
    { id: '9:16', label: '9:16 · Stories' },
    { id: '1:1',  label: '1:1 · Feed' },
    { id: '16:9', label: '16:9 · X' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
      <div style={{
        position: 'relative', background: sheetBg,
        borderTopLeftRadius: 22, borderTopRightRadius: 22,
        padding: '10px 14px 36px', boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 99,
          background: dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)', margin: '4px auto 12px' }} />
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 4px' }}>
          <div style={{ fontSize: 17, fontWeight: 600, color: text,
            fontFamily: '"Source Serif 4", Georgia, serif', letterSpacing: -0.2 }}>Share card</div>
          <button onClick={onClose} style={{ all: 'unset', cursor: 'pointer', fontSize: 13, color: muted }}>cancel</button>
        </div>

        {/* Ratio toggle */}
        <div style={{ display: 'flex', gap: 6, marginTop: 12, padding: '0 2px' }}>
          {ratios.map(r => (
            <button key={r.id} onClick={() => setRatio(r.id)} style={{
              all: 'unset', cursor: 'pointer', flex: 1, textAlign: 'center',
              padding: '7px 6px', borderRadius: 10, fontSize: 11.5, fontWeight: 500,
              fontFamily: '"SF Mono", monospace', letterSpacing: 0.1,
              background: ratio === r.id ? (dark ? '#fff' : '#1a1814') : (dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
              color: ratio === r.id ? (dark ? '#1a1814' : '#fff') : muted,
            }}>{r.label}</button>
          ))}
        </div>

        {/* Preview */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, overflow: 'hidden' }}>
          <ShareCardPreview data={card} ratio={ratio} />
        </div>

        {/* Share buttons */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          {['Copy image', 'Instagram', 'X / Twitter'].map(label => (
            <button key={label} style={{
              all: 'unset', cursor: 'pointer', flex: 1, textAlign: 'center',
              padding: '10px 6px', borderRadius: 12, fontSize: 12, fontWeight: 500, color: text,
              background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.06)',
            }}>{label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
