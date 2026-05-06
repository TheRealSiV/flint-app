/**
 * Pure-TS port of FSRS-5 (Free Spaced Repetition Scheduler).
 * Used on the client for offline SR scheduling; the server runs the same
 * algorithm in Go (services/api/internal/fsrs) as the source of truth.
 *
 * Ref: https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm
 */

export type Rating = 1 | 2 | 3 | 4; // Again | Hard | Good | Easy

export interface FSRSState {
  stability: number;   // S — how long until 90% retention
  difficulty: number;  // D — inherent difficulty [1,10]
  reps: number;
  lapses: number;
  dueAt: Date;
}

const W = [0.4072, 1.1829, 3.1262, 15.4722, 7.2102, 0.5316, 1.0651,
           0.0589, 1.5330, 0.1544, 1.0070, 1.9416, 0.1100, 0.2900,
           2.2700, 0.2500, 2.9898, 0.5100, 0.3400];

function clamp(x: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, x));
}

export function initialState(rating: Rating, now = new Date()): FSRSState {
  const s = W[rating - 1];
  const d = clamp(W[4] - Math.exp(W[5] * (rating - 1)) + 1, 1, 10);
  const interval = Math.round(s);
  const dueAt = new Date(now.getTime() + interval * 864e5);
  return { stability: s, difficulty: d, reps: 1, lapses: 0, dueAt };
}

export function nextState(state: FSRSState, rating: Rating, now = new Date()): FSRSState {
  const { stability: s, difficulty: d } = state;
  const retrievability = Math.exp(-0.9 * daysSince(state.dueAt, now) / s);

  let newS: number;
  let newD = clamp(d + W[6] * (rating - 3), 1, 10);
  let lapses = state.lapses;

  if (rating === 1) {
    lapses++;
    newS = W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - retrievability));
  } else {
    newS = s * Math.exp(W[8] * (11 - newD) * Math.pow(s, -W[9]) * (Math.exp(W[10] * (1 - retrievability)) - 1));
    if (rating === 2) newS *= W[15];
    if (rating === 4) newS *= W[16];
  }

  const interval = Math.round(newS * 9 / 10); // target 90% retention
  const dueAt = new Date(now.getTime() + Math.max(1, interval) * 864e5);

  return {
    stability: clamp(newS, 0.1, 36500),
    difficulty: newD,
    reps: state.reps + 1,
    lapses,
    dueAt,
  };
}

function daysSince(past: Date, now: Date): number {
  return (now.getTime() - past.getTime()) / 864e5;
}
