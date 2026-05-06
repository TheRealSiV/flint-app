# Contributing cards

Cards live as YAML files in `content/community/<topic>/`. Adding a card is a regular pull request.

## Card schema

See `schema.json` for the full spec. Quick reference:

| Field        | Required | Notes |
|---|---|---|
| `type`       | ✓ | `fact` `vocab` `sentence` `quiz` `concept` |
| `language`   | ✓ | BCP-47: `en`, `ja`, `zh`, etc. |
| `front`      | ✓ | Hook for fact/concept; target word for vocab. Max 280 chars. |
| `back`       |   | Meaning or answer. |
| `context`    |   | Supporting paragraph. Max 600 chars. |
| `source_name`| ✓ | Readable citation, e.g. `Wikipedia · Cephalopods` |
| `source_url` |   | Canonical URL. |
| `tags`       | ✓ | At least one topic tag. |
| `difficulty` |   | 1 (easiest) – 5 (hardest). Leave blank to let AI estimate. |

## Writing a strong hook

The hook is the most important field. It's the one sentence that earns the scroll stop.

**Strong:**
> An octopus has three hearts — and two stop beating the moment it swims

**Weak:**
> Octopuses have an unusual circulatory system with multiple hearts

Rules:
- Start with the surprising fact, not the topic label
- Concrete nouns > abstractions ("3 hearts" not "unusual anatomy")
- Present tense, active voice
- No "Did you know" or "Fun fact" openers
- Max 120 characters

## Moderation

All PRs run the CI content linter (`workflows/content.yml`), which:
1. Validates YAML against `schema.json`
2. Checks for duplicates (embedding cosine similarity > 0.92)
3. Runs a Claude Haiku moderation pass for policy + factual plausibility

Cards that pass land in the `submissions` table with `status=pending` for a final human review.
