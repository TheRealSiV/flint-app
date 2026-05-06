package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/learnscroll/ingest/internal/sources"
)

var rootCmd = &cobra.Command{
	Use:   "lsctl",
	Short: "LearnScroll content ingest CLI",
}

var ingestCmd = &cobra.Command{
	Use:   "ingest <source> <path>",
	Short: "Ingest content from a source into the cards table",
	Long: `Sources:
  anki      <path/to/deck.apkg>
  tatoeba   <path/to/sentences.tsv>
  wiki      <language-code>            (fetches live from MediaWiki API)
  openstax  <subject>                  (fetches live from OpenStax API)
  community <path/to/content/dir>      (reads YAML diffs)`,
	Args: cobra.ExactArgs(2),
	RunE: func(cmd *cobra.Command, args []string) error {
		source, path := args[0], args[1]
		switch source {
		case "anki":
			return sources.IngestAnki(path)
		case "tatoeba":
			return sources.IngestTatoeba(path)
		case "wiki":
			return sources.IngestWiki(path)
		case "openstax":
			return sources.IngestOpenStax(path)
		case "community":
			return sources.IngestCommunity(path)
		default:
			return fmt.Errorf("unknown source %q", source)
		}
	},
}

func main() {
	rootCmd.AddCommand(ingestCmd)
	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}
