export type CardType = 'fact' | 'vocab' | 'sentence' | 'quiz' | 'concept';

export interface Card {
  id: string;
  type: CardType;
  language: string;
  front: string;
  back?: string;
  context?: string;
  sourceName?: string;
  sourceUrl?: string;
  tags: string[];
  difficulty?: number;
  diagramKind?: string;
  quizOptions?: string[];
  quizAnswerIdx?: number;
  audioUrl?: string;
}

export interface User {
  id: string;
  email?: string;
  handle?: string;
  languageGoal?: string;
  dailyTarget: number;
  streakCount: number;
}

export interface CardProgress {
  userId: string;
  cardId: string;
  stability: number;
  difficulty: number;
  dueAt?: string;    // ISO 8601
  lastSeenAt?: string;
  reps: number;
  lapses: number;
  reaction?: 'love' | 'blown' | 'knew' | 'bookmark';
}

export interface FeedEvent {
  cardId: string;
  kind: 'impression' | 'dwell' | 'react' | 'skip' | 'deeper';
  payload?: Record<string, unknown>;
  createdAt: string;
}
