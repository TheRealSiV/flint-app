-- Dev seed data — run after migrations
-- Usage: psql $DATABASE_URL -f db/seed.sql

INSERT INTO cards (id, type, language, front, back, context, source_name, tags, difficulty, approved)
VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    'fact', 'en',
    'An octopus has three hearts — and two stop beating the moment it swims.',
    NULL,
    'Two branchial hearts pump blood through the gills; the third sends oxygenated blood to the body. The systemic heart pauses during swimming, which is why octopuses prefer to crawl.',
    'Wikipedia · Cephalopods',
    ARRAY['biology','marine'],
    2,
    true
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    'vocab', 'ja',
    '橋',
    'bridge',
    'あの橋を渡ってください。',
    'JLPT N5',
    ARRAY['ja','N5'],
    1,
    true
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    'quiz', 'en',
    'Which empire built the Library of Alexandria?',
    'Ptolemaic Kingdom',
    'Founded around 283 BCE by Ptolemy I Soter, a former general of Alexander the Great.',
    'OpenStax · World History',
    ARRAY['history','ancient'],
    3,
    true
  ),
  (
    'a0000000-0000-0000-0000-000000000004',
    'concept', 'en',
    'The Silk Road wasn''t one road — it was a shifting network spanning 4,000 miles.',
    NULL,
    'Active from roughly 130 BCE to 1453 CE, it linked Chang''an to the Mediterranean.',
    'Wikipedia · World History',
    ARRAY['history','trade'],
    3,
    true
  ),
  (
    'a0000000-0000-0000-0000-000000000005',
    'fact', 'en',
    'Honey never spoils — archaeologists have eaten 3,000-year-old jars from Egyptian tombs.',
    NULL,
    'Honey''s low water content and acidic pH (3.9) make it inhospitable to microbes.',
    'Wikipedia · Food chemistry',
    ARRAY['biology','chemistry'],
    1,
    true
  ),
  (
    'a0000000-0000-0000-0000-000000000006',
    'vocab', 'ja',
    '黄昏',
    'twilight; dusk',
    '黄昏に空が赤く染まる。',
    'JLPT N2',
    ARRAY['ja','N2'],
    4,
    true
  ),
  (
    'a0000000-0000-0000-0000-000000000007',
    'fact', 'en',
    'Bananas are slightly radioactive — and you''d need to eat 10 million in one sitting to get hurt.',
    NULL,
    'Bananas contain potassium-40, a naturally radioactive isotope.',
    'Wikipedia · Radiology',
    ARRAY['physics','biology'],
    2,
    true
  ),
  (
    'a0000000-0000-0000-0000-000000000008',
    'vocab', 'ja',
    '勿体無い',
    'wasteful; too good for',
    '残すのはもったいないよ。',
    'JLPT N3',
    ARRAY['ja','N3'],
    3,
    true
  )
ON CONFLICT (id) DO NOTHING;
