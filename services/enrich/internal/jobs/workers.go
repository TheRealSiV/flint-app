package jobs

import "context"

// WorkerPool manages a pool of River job workers.
type WorkerPool struct {
	concurrency int
}

func NewWorkerPool() *WorkerPool {
	return &WorkerPool{concurrency: 10}
}

func (p *WorkerPool) Concurrency() int { return p.concurrency }

func (p *WorkerPool) Run(ctx context.Context) error {
	// TODO: river.NewWorkers(), river.AddWorker() for each job type, client.Start()
	<-ctx.Done()
	return nil
}
