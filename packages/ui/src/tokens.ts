/** Design tokens — single source of truth for colors, type, and spacing. */

export const color = {
  bg:      { light: '#FAF7F1', dark: '#0F0E0C' },
  ink:     { light: '#1a1814', dark: '#f1ede5' },
  muted:   { light: '#7a766f', dark: 'rgba(255,255,255,0.55)' },
  border:  { light: 'rgba(60,60,67,0.10)', dark: 'rgba(255,255,255,0.08)' },
  accent:  '#E2861A',
  panel:   { light: '#fff', dark: '#1c1a17' },
} as const;

export const cardPalette = {
  fact:    { bg: '#E1F5EE', text: '#085041', label: 'Fact'    },
  vocab:   { bg: '#EEEDFE', text: '#3C3489', label: 'Vocab'   },
  sentence:{ bg: '#FAECE7', text: '#712B13', label: 'Sentence'},
  quiz:    { bg: '#E6F1FB', text: '#0C447C', label: 'Quiz'    },
  concept: { bg: '#FAEEDA', text: '#633806', label: 'Concept' },
} as const;

export const font = {
  serif:  '"Source Serif 4", Georgia, serif',
  jpSerif:'"Noto Serif JP", "Hiragino Mincho ProN", serif',
  jpSans: '"Noto Sans JP", "Hiragino Sans", sans-serif',
  mono:   '"SF Mono", ui-monospace, Menlo, monospace',
  sans:   '-apple-system, "SF Pro Text", system-ui, sans-serif',
} as const;
