'use client';
import dynamic from 'next/dynamic';

// ssr: false prevents Next.js from touching browser APIs (localStorage, etc.)
// during server-side rendering. The mounted guard in App.tsx is a second layer.
const App = dynamic(() => import('@/components/App'), { ssr: false });

export default function Home() {
  return <App />;
}
