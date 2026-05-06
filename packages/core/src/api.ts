import type { Card, CardProgress, FeedEvent } from './types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  feed: {
    get: (cursor?: string) =>
      get<{ cards: Card[]; nextCursor: string }>(`/v1/feed${cursor ? `?cursor=${cursor}` : ''}`),
    getThread: (id: string) =>
      get<{ cards: Card[] }>(`/v1/threads/${id}`),
  },
  cards: {
    get: (id: string) => get<{ card: Card }>(`/v1/cards/${id}`),
    react: (id: string, kind: string) => post<void>(`/v1/cards/${id}/react`, { kind }),
    quiz: (id: string, picked: number) => post<void>(`/v1/cards/${id}/quiz`, { picked }),
  },
  progress: {
    get: () => get<{ streak: number; dailyGoal: number; doneToday: number; dueCount: number }>('/v1/progress'),
    sync: (events: FeedEvent[]) => post<void>('/v1/progress/sync', { events }),
    due: () => get<{ cards: Card[] }>('/v1/progress/due'),
  },
  vocab: {
    known: () => get<{ words: string[] }>('/v1/vocab/known'),
    markKnown: (lemma: string, language: string) => post<void>('/v1/vocab/known', { lemma, language }),
  },
  ai: {
    explain: (cardId: string, question: string) => post<{ text: string }>('/v1/ai/explain', { cardId, question }),
    tutor: (message: string, context: unknown) => post<{ text: string }>('/v1/ai/tutor', { message, context }),
  },
  auth: {
    magic: (email: string) => post<void>('/v1/auth/magic', { email }),
  },
};
