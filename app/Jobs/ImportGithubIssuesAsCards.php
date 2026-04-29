<?php

namespace App\Jobs;

use App\Models\Board;
use App\Models\Card;
use App\Models\GithubCardLink;
use App\Models\GithubRepository;
use App\Models\User;
use App\Services\GitHubService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ImportGithubIssuesAsCards implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Board $board,
        public readonly int $repositoryId,
        public readonly User $user,
        public readonly string $state = 'open',
    ) {}

    public function handle(GitHubService $github): void
    {
        $repo = GithubRepository::findOrFail($this->repositoryId);
        $account = $github->getAccountForRepo($repo);

        $issues = $github->getIssues($account, $repo, $this->state);

        // Import into the first active list, or bail if none
        $list = $this->board->lists()->whereNull('archived_at')->orderBy('position')->first();
        if (! $list) {
            return;
        }

        foreach ($issues as $issue) {
            // Skip if already linked
            $alreadyLinked = GithubCardLink::where('github_repository_id', $repo->id)
                ->whereHas('card', fn ($q) => $q->where('board_id', $this->board->id))
                ->where('issue_number', $issue['number'])
                ->exists();

            if ($alreadyLinked) {
                continue;
            }

            $position = Card::where('list_id', $list->id)->whereNull('archived_at')->max('position') ?? 0;

            $card = Card::create([
                'board_id' => $this->board->id,
                'list_id' => $list->id,
                'creator_id' => $this->user->id,
                'title' => $issue['title'],
                'description' => $issue['body'] ?: null,
                'position' => $position + 1,
                'priority' => 'none',
                'source_system' => 'github',
                'source_card_id' => (string) $issue['id'],
                'source_board_id' => $repo->full_name,
                'completed_at' => ($issue['state'] === 'closed') ? now() : null,
            ]);

            GithubCardLink::create([
                'card_id' => $card->id,
                'github_repository_id' => $repo->id,
                'github_issue_id' => $issue['id'],
                'issue_number' => $issue['number'],
                'issue_url' => $issue['html_url'],
                'issue_state' => $issue['state'],
                'last_synced_source' => 'github',
                'last_synced_at' => now(),
            ]);
        }
    }
}
