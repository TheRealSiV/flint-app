import type { NextConfig } from "next";

// Node 25 ships a built-in `localStorage` object that exists but lacks
// `getItem` / `setItem` / etc., causing Next.js's router to crash on startup.
// Patch it with a no-op in-memory store so the server never throws.
if (typeof globalThis.localStorage !== 'undefined' &&
    typeof globalThis.localStorage.getItem !== 'function') {
  const store: Record<string, string> = {};
  globalThis.localStorage = {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    key: (i: number) => Object.keys(store)[i] ?? null,
    get length() { return Object.keys(store).length; },
  } as Storage;
}

const nextConfig: NextConfig = {};

export default nextConfig;
