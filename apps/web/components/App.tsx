'use client';
import { useState, useRef, useEffect } from 'react';
import { AnyCard } from '@/lib/data';
import { FeedScreen, TopicsScreen, ProgressScreen, ProfileScreen, RabbitHoleScreen } from './Screens';
import { BottomNav, ShareSheet } from './Chrome';

type Tab = 'feed' | 'topics' | 'progress' | 'profile';

export default function App() {
  const [mounted, setMounted]     = useState(false);
  const [dark, setDark]           = useState(false);
  const [tab, setTab]             = useState<Tab>('feed');
  const [thread, setThread]       = useState<string | null>(null);
  const [shareCard, setShareCard] = useState<AnyCard | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const streak = 23;

  const bg = dark ? '#0F0E0C' : '#FAF7F1';

  const goDeeper = (threadId: string) => {
    setThread(threadId);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    setThread(null);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [tab]);

  if (!mounted) return null;

  let content: React.ReactNode;
  if (thread) {
    content = <RabbitHoleScreen threadId={thread} dark={dark} onBack={() => setThread(null)} onShare={setShareCard} />;
  } else if (tab === 'feed') {
    content = <FeedScreen dark={dark} onDeeper={goDeeper} onShare={setShareCard} streak={streak} />;
  } else if (tab === 'topics') {
    content = <TopicsScreen dark={dark} />;
  } else if (tab === 'progress') {
    content = <ProgressScreen dark={dark} streak={streak} />;
  } else {
    content = <ProfileScreen dark={dark} setDark={setDark} />;
  }

  return (
    <div style={{ background: bg, minHeight: '100dvh' }}>
      <div
        ref={scrollRef}
        style={{
          height: '100dvh',
          overflowY: 'auto',
          paddingTop: 'env(safe-area-inset-top, 44px)',
          paddingBottom: 80,
          background: bg,
        }}
      >
        {content}
      </div>
      <BottomNav active={tab} setActive={(t) => setTab(t as Tab)} dark={dark} />
      {shareCard && <ShareSheet card={shareCard} dark={dark} onClose={() => setShareCard(null)} />}
    </div>
  );
}
