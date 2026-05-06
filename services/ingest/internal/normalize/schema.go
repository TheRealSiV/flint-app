package normalize

// Card is the unified output type all sources must produce.
// It maps directly to the cards table in Postgres.
type Card struct {
	Type        string   // fact | vocab | sentence | quiz | concept
	Language    string   // BCP-47, e.g. "ja", "en"
	Front       string   // hook text or Japanese word
	Back        string   // meaning / answer
	Context     string   // supporting paragraph
	SourceURL   string
	SourceName  string
	Tags        []string
	Difficulty  int      // 1–5
	DiagramKind string   // key into the SVG diagram set
	QuizOptions []string // for quiz cards
	QuizAnswer  int      // 0-indexed correct option
}
