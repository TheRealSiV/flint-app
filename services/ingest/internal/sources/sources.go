package sources

import "fmt"

// Each function parses a source, normalizes to []normalize.Card, and bulk-inserts into Postgres.

func IngestAnki(path string) error {
	// 1. Open .apkg (it's a zip). Extract collection.anki21 (SQLite).
	// 2. SELECT id, flds, tags FROM notes.
	// 3. Map note type to vocab or quiz card.
	// 4. Bulk insert via COPY.
	return fmt.Errorf("TODO: ingest anki %s", path)
}

func IngestTatoeba(path string) error {
	// 1. Stream TSV: sentence_id \t lang \t text.
	// 2. Filter ja rows; pair with linked English translation.
	// 3. Tokenise bracketed unknowns via mecab or pre-built word list.
	// 4. Bulk insert as sentence cards.
	return fmt.Errorf("TODO: ingest tatoeba %s", path)
}

func IngestWiki(langCode string) error {
	// 1. Call MediaWiki API: action=query&list=random&rnnamespace=0&rnlimit=50.
	// 2. Fetch lead section for each article.
	// 3. Extract first sentence as hook, second paragraph as context.
	// 4. Tag by WikiProject category.
	return fmt.Errorf("TODO: ingest wiki %s", langCode)
}

func IngestOpenStax(subject string) error {
	// 1. Fetch OpenStax REST API for subject.
	// 2. Extract chapter review questions as quiz cards.
	// 3. Map answer key to quiz_answer_idx.
	return fmt.Errorf("TODO: ingest openstax %s", subject)
}

func IngestCommunity(dir string) error {
	// 1. Walk dir for *.yaml files added/modified in last git diff.
	// 2. Validate each file against content/schema.json.
	// 3. Insert into submissions table (status=pending) for moderation.
	return fmt.Errorf("TODO: ingest community %s", dir)
}
