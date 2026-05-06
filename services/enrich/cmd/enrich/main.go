package main

import (
	"context"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/learnscroll/enrich/internal/jobs"
)

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	// TODO: connect to Postgres + River queue
	// TODO: register job workers
	workers := jobs.NewWorkerPool()
	slog.Info("enrich worker starting", "concurrency", workers.Concurrency())

	if err := workers.Run(ctx); err != nil {
		slog.Error("worker pool failed", "err", err)
		os.Exit(1)
	}
}
