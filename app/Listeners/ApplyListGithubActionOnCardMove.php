<?php

namespace App\Listeners;

use App\Events\CardMoved;
use App\Models\BoardList;
use App\Models\Card;
use App\Models\GithubCardLink;
use App\Services\GitHubService;
use Illuminate\Contracts\Queue\ShouldQueue;

class ApplyListGithubActionOnCardMove implements ShouldQueue
{
    public function __construct(private readonly GitHubService $github) {}

    public function handle(CardMoved $event): void
    {
        $card = $event->card;
        $list = BoardList::find($card->list_id);

        if (! $list || ! $list->github_action) {
            return;
        }

        $link = $card->githubLink;
        if (! $link) {
            if ($list->github_action === 'open_issue') {
                $this->openNewIssue($card, $list);
            }

            return;
        }

        $repo = $link->githubRepository;
        $account = $this->github->getAccountForRepo($repo);

        match ($list->github_action) {
            'close_issue' => $this->github->updateIssue($account, $repo, $link->issue_number, ['state' => 'closed']),
            'reopen_issue' => $this->github->updateIssue($account, $repo, $link->issue_number, ['state' => 'open']),
            'open_issue' => null, // already linked, nothing to do
            default => null,
        };

        $link->update(['issue_state' => $list->github_action === 'close_issue' ? 'closed' : 'open', 'last_synced_at' => now()]);
    }

    private function openNewIssue(Card $card, BoardList $list): void
    {
        $card->loadMissing('board');
        $board = $card->board;

        $repo = $board->githubRepositories()->first();
        if (! $repo) {
            return;
        }

        $account = $this->github->getAccountForRepo($repo);
        $issue = $this->github->createIssue($account, $repo, $card->title, $card->description);

        GithubCardLink::create([
            'card_id' => $card->id,
            'github_repository_id' => $repo->id,
            'github_issue_id' => $issue['id'],
            'issue_number' => $issue['number'],
            'issue_url' => $issue['html_url'],
            'issue_state' => $issue['state'],
            'last_synced_source' => 'board',
            'last_synced_at' => now(),
        ]);
    }
}
