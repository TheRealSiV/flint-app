import type { Card, CardType } from './types';

/** Default feed mix ratios (must sum to 1). */
export const DEFAULT_MIX: Record<CardType, number> = {
  vocab:    0.35,
  fact:     0.20,
  concept:  0.10,
  quiz:     0.20,
  sentence: 0.15,
};

/**
 * Returns true if adding this card type would keep the window
 * within the target mix (±10% tolerance).
 */
export function withinMix(
  window: Card[],
  candidate: CardType,
  mix = DEFAULT_MIX,
): boolean {
  const total = window.length + 1;
  const counts = countTypes(window);
  counts[candidate] = (counts[candidate] ?? 0) + 1;

  for (const [type, target] of Object.entries(mix) as [CardType, number][]) {
    const actual = (counts[type] ?? 0) / total;
    if (actual > target + 0.10) return false;
  }
  return true;
}

function countTypes(cards: Card[]): Partial<Record<CardType, number>> {
  return cards.reduce((acc, c) => {
    acc[c.type] = (acc[c.type] ?? 0) + 1;
    return acc;
  }, {} as Partial<Record<CardType, number>>);
}
