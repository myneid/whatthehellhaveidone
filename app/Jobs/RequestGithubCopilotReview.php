<?php

namespace App\Jobs;

use App\Models\GithubRepository;
use App\Services\GitHubService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use RuntimeException;

class RequestGithubCopilotReview implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly GithubRepository $repository,
        public readonly int $pullNumber,
    ) {}

    public function handle(GitHubService $github): void
    {
        $account = $github->getAccountForRepo($this->repository);

        try {
            $github->requestCopilotCodeReview($account, $this->repository, $this->pullNumber);
        } catch (RuntimeException $exception) {
            if (! $this->isAlreadyRequested($exception)) {
                throw $exception;
            }
        }
    }

    private function isAlreadyRequested(RuntimeException $exception): bool
    {
        return str_contains($exception->getMessage(), '(HTTP 422)');
    }
}
