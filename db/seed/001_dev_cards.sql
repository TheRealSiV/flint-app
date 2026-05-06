-- Dev seed: 5 representative cards, 1 user. Run after migrations.

INSERT INTO users (id, email, handle, language_goal, daily_target)
VALUES ('00000000-0000-0000-0000-000000000001', 'dev@flint.local', 'dev', 'ja-N4', 10);

INSERT INTO cards (id, type, language, front, back, context, source_name, tags, approved) VALUES
  ('10000000-0000-0000-0000-000000000001', 'fact', 'en',
   'An octopus has three hearts — and two stop beating the moment it swims',
   NULL,
   'Two branchial hearts pump blood through the gills; the systemic heart pauses during swimming.',
   'Wikipedia · Cephalopods', ARRAY['biology','marine'], true),

  ('10000000-0000-0000-0000-000000000002', 'vocab', 'ja',
   '橋', 'bridge', NULL, 'Tatoeba · Core 6000',
   ARRAY['ja','N5'], true),

  ('10000000-0000-0000-0000-000000000003', 'quiz', 'en',
   'Which empire built the Library of Alexandria?', 'Ptolemaic Kingdom',
   'Founded around 283 BCE by Ptolemy I Soter.',
   'OpenStax · World History', ARRAY['history','ancient'], true),

  ('10000000-0000-0000-0000-000000000004', 'sentence', 'ja',
   '今日は新しいレストランで食べました。', 'Today I ate at a new restaurant.',
   NULL, 'Tatoeba', ARRAY['ja','N5'], true),

  ('10000000-0000-0000-0000-000000000005', 'concept', 'en',
   'The Silk Road wasn''t one road — it was a shifting network spanning 4,000 miles',
   NULL,
   'Active from roughly 130 BCE to 1453 CE, linking Chang''an to the Mediterranean.',
   'Wikipedia · World History', ARRAY['history','trade'], true);
