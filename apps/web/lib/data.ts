export type CardType = 'fact' | 'vocab' | 'sentence' | 'quiz' | 'concept';

export interface FactCard {
  id: string; type: 'fact';
  hook: string; context: string; source: string; tags: string[];
  diagram?: string; related?: string[];
}

export interface VocabCard {
  id: string; type: 'vocab';
  reading: string; word: string; meaning: string;
  pos: string; pitch: string; level: string;
  example: string; exampleTl: string;
  badge?: string; tags: string[];
}

export interface SentenceCard {
  id: string; type: 'sentence';
  sentence: string; sentencePlain: string; translation: string;
  unknown: { word: string; reading: string; meaning: string }[];
  source: string; tags: string[];
}

export interface QuizCard {
  id: string; type: 'quiz';
  question: string; options: string[]; correct: number; explanation: string;
  source: string; tags: string[];
}

export interface ConceptCard {
  id: string; type: 'concept';
  hook: string; context: string; source: string; tags: string[];
  diagram?: string; deeper?: string;
}

export type AnyCard = FactCard | VocabCard | SentenceCard | QuizCard | ConceptCard;

export const FEED_CARDS: AnyCard[] = [
  {
    id: 'c1', type: 'fact',
    hook: "An octopus has three hearts — and two stop beating the moment it swims.",
    context: "Two branchial hearts pump blood through the gills; the third sends oxygenated blood to the body. The systemic heart pauses during swimming, which is why octopuses prefer to crawl.",
    source: 'Wikipedia · Cephalopods', tags: ['biology', 'marine'], diagram: 'octopus',
  },
  {
    id: 'c2', type: 'vocab',
    reading: 'はし', word: '橋', meaning: 'bridge', pos: 'noun',
    pitch: 'はし＼ → はし／ (heiban)',
    example: 'あの橋を渡ってください。', exampleTl: 'Please cross that bridge.',
    badge: 'New', level: 'JLPT N5', tags: ['ja', 'N5'],
  },
  {
    id: 'c3', type: 'quiz',
    question: "Which empire built the Library of Alexandria?",
    options: ["Roman Empire", "Ptolemaic Kingdom", "Achaemenid Persia", "Seleucid Empire"],
    correct: 1,
    explanation: "Founded around 283 BCE by Ptolemy I Soter, a former general of Alexander the Great. The Ptolemies were Greek rulers of Egypt, not Romans — that's a common confusion.",
    source: 'OpenStax · World History', tags: ['history', 'ancient'],
  },
  {
    id: 'c4', type: 'sentence',
    sentence: '今日は[新しい]レストランで[食べ]ました。',
    sentencePlain: '今日は新しいレストランで食べました。',
    translation: 'Today I ate at a new restaurant.',
    unknown: [
      { word: '新しい', reading: 'あたらしい', meaning: 'new' },
      { word: '食べる', reading: 'たべる', meaning: 'to eat' },
    ],
    source: 'Tatoeba', tags: ['ja', 'N5'],
  },
  {
    id: 'c5', type: 'concept',
    hook: "The Silk Road wasn't one road — it was a shifting network spanning 4,000 miles.",
    context: "Active from roughly 130 BCE to 1453 CE, it linked Chang'an to the Mediterranean. Traders rarely traveled the full length — goods, ideas, and pathogens passed hand to hand through middlemen at oasis cities.",
    diagram: 'silk-road', source: 'Wikipedia · World History', tags: ['history', 'trade'],
    deeper: 'silk-road-thread',
  },
  {
    id: 'c6', type: 'vocab',
    reading: 'たそがれ', word: '黄昏', meaning: 'twilight; dusk', pos: 'noun',
    pitch: 'たそが＼れ (atamadaka)',
    example: '黄昏に空が赤く染まる。', exampleTl: 'The sky dyes red at twilight.',
    badge: 'Due review', level: 'JLPT N2', tags: ['ja', 'N2'],
  },
  {
    id: 'c7', type: 'fact',
    hook: "Honey never spoils — archaeologists have eaten 3,000-year-old jars from Egyptian tombs.",
    context: "Honey's low water content and acidic pH (3.9) make it inhospitable to microbes. Bees also add an enzyme that produces hydrogen peroxide, sterilizing the comb as they work.",
    source: 'Wikipedia · Food chemistry', tags: ['biology', 'chemistry'], diagram: 'honey',
  },
  {
    id: 'c8', type: 'concept',
    hook: "Every cell in your body, except red blood cells, contains the entire blueprint to build you.",
    context: "About 3 billion base pairs, coiled into 23 chromosome pairs, packed into a nucleus 6 micrometers across. Stretched out, the DNA in one cell would reach 2 meters.",
    diagram: 'cell', source: 'OpenStax · Biology', tags: ['biology', 'cells'],
    deeper: 'cells-thread',
  },
  {
    id: 'c9', type: 'quiz',
    question: "Which language family does Japanese belong to?",
    options: ["Sino-Tibetan", "Altaic", "Japonic (its own family)", "Austronesian"],
    correct: 2,
    explanation: "Japanese is part of the small Japonic family, which includes Ryukyuan languages. Its relationship to Korean and Altaic languages remains debated but unconfirmed.",
    source: 'Wikipedia · Linguistics', tags: ['language', 'linguistics'],
  },
  {
    id: 'c10', type: 'sentence',
    sentence: '[星]が[綺麗]に見えますね。',
    sentencePlain: '星が綺麗に見えますね。',
    translation: "The stars look beautiful, don't they.",
    unknown: [
      { word: '星', reading: 'ほし', meaning: 'star' },
      { word: '綺麗', reading: 'きれい', meaning: 'beautiful, pretty' },
    ],
    source: 'Tatoeba', tags: ['ja', 'N4'],
  },
  {
    id: 'c11', type: 'fact',
    hook: "Bananas are slightly radioactive — and you'd need to eat 10 million in one sitting to get hurt.",
    context: "Bananas contain potassium-40, a naturally radioactive isotope. The dose from one banana is so small that 'banana equivalent dose' is sometimes used as a casual unit for radiation exposure.",
    source: 'Wikipedia · Radiology', tags: ['physics', 'biology'], diagram: 'banana',
  },
  {
    id: 'c12', type: 'vocab',
    reading: 'もったいない', word: '勿体無い', meaning: 'wasteful; too good for', pos: 'i-adjective',
    pitch: 'もったいな＼い (atamadaka)',
    example: '残すのはもったいないよ。', exampleTl: 'Leaving leftovers would be a waste.',
    badge: 'New', level: 'JLPT N3', tags: ['ja', 'N3'],
  },
];

export const THREADS: Record<string, { name: string; cards: AnyCard[] }> = {
  'silk-road-thread': {
    name: 'Silk Road',
    cards: [
      {
        id: 'sr1', type: 'fact',
        hook: "Paper money first appeared in 7th-century China — and Marco Polo couldn't believe it was real.",
        context: 'During the Tang dynasty, merchants used "flying cash" certificates to avoid hauling copper coins. Polo wrote of paper "treated as if it were pure gold."',
        source: 'Wikipedia · Tang dynasty', tags: ['history'],
      },
      {
        id: 'sr2', type: 'concept',
        hook: 'The Black Death likely traveled the Silk Road in fleas riding marmots.',
        context: 'Genetic evidence traces Yersinia pestis to Central Asia. Caravans carrying furs and grain provided the perfect vector to Crimea, then to Europe by 1347.',
        diagram: 'plague', source: 'Wikipedia · Black Death', tags: ['history', 'disease'],
      },
      {
        id: 'sr3', type: 'fact',
        hook: "Silk's secret was guarded so fiercely, smuggling silkworm eggs out of China carried a death sentence.",
        context: 'For ~3,000 years China monopolized silk. The secret leaked around 552 CE when Byzantine monks smuggled eggs to Constantinople inside hollow bamboo canes.',
        source: 'Wikipedia · Sericulture', tags: ['history'],
      },
      {
        id: 'sr4', type: 'quiz',
        question: 'What was the most-traded commodity on the Silk Road by volume?',
        options: ['Silk', 'Horses', 'Spices', 'Glass'],
        correct: 1,
        explanation: 'Despite the name, horses moved in greater volumes — China traded silk and tea for nomadic warhorses essential to its military.',
        source: 'OpenStax · World History', tags: ['history'],
      },
      {
        id: 'sr5', type: 'vocab',
        reading: 'シルクロード', word: 'シルクロード', meaning: 'Silk Road', pos: 'noun', pitch: '',
        example: 'シルクロードは長い歴史がある。', exampleTl: 'The Silk Road has a long history.',
        badge: '', level: 'JLPT N3', tags: ['ja'],
      },
    ],
  },
};

export const TOPICS = [
  { name: 'Biology',    count: 482,  color: '#085041', bg: '#E1F5EE', icon: '◐' },
  { name: 'History',    count: 631,  color: '#633806', bg: '#FAEEDA', icon: '◇' },
  { name: 'Japanese',   count: 2104, color: '#3C3489', bg: '#EEEDFE', icon: '語' },
  { name: 'Physics',    count: 297,  color: '#0C447C', bg: '#E6F1FB', icon: '∞' },
  { name: 'Linguistics',count: 184,  color: '#712B13', bg: '#FAECE7', icon: '✎' },
  { name: 'Chemistry',  count: 256,  color: '#085041', bg: '#E1F5EE', icon: '◯' },
  { name: 'Astronomy',  count: 173,  color: '#0C447C', bg: '#E6F1FB', icon: '★' },
  { name: 'Philosophy', count: 89,   color: '#444441', bg: '#F1EFE8', icon: '∴' },
];

export const CARD_PALETTE: Record<string, { bg: string; text: string; label: string }> = {
  fact:    { bg: '#E1F5EE', text: '#085041', label: 'Fact'    },
  vocab:   { bg: '#EEEDFE', text: '#3C3489', label: 'Vocab'   },
  sentence:{ bg: '#FAECE7', text: '#712B13', label: 'Sentence'},
  quiz:    { bg: '#E6F1FB', text: '#0C447C', label: 'Quiz'    },
  concept: { bg: '#FAEEDA', text: '#633806', label: 'Concept' },
  thread:  { bg: '#F1EFE8', text: '#444441', label: 'Thread'  },
};
