<?php

use App\Jobs\ProcessGithubWebhook;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\Card;
use App\Models\GithubAccount;
use App\Models\GithubCardLink;
use App\Models\GithubRepository;
use App\Models\GithubWebhookEvent;
use App\Models\User;
use App\Services\ActivityLogService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;

uses(RefreshDatabase::class);

it('moves a linked card to the configured copilot done list when copilot opens a reviewable pull request', function (): void {
    /** @var User $user */
    $user = User::factory()->create();

    $board = Board::create([
        'owner_id' => $user->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-copilot-review',
        'visibility' => 'team',
    ]);

    $backlog = BoardList::create([
        'board_id' => $board->id,
        'name' => 'Backlog',
        'position' => 1,
    ]);

    $review = BoardList::create([
        'board_id' => $board->id,
        'name' => 'Review',
        'position' => 2,
    ]);

    $board->update(['copilot_done_list_id' => $review->id]);

    $card = Card::create([
        'board_id' => $board->id,
        'list_id' => $backlog->id,
        'creator_id' => $user->id,
        'title' => 'Implement the webhook flow',
        'position' => 1,
    ]);

    $account = GithubAccount::create([
        'user_id' => $user->id,
        'github_user_id' => '12345',
        'username' => 'octocat',
        'encrypted_access_token' => Crypt::encryptString('github-user-token'),
        'scopes' => ['repo'],
    ]);

    $repository = GithubRepository::create([
        'github_account_id' => $account->id,
        'github_repo_id' => '98765',
        'owner' => 'octo-org',
        'name' => 'octo-repo',
        'full_name' => 'octo-org/octo-repo',
        'private' => true,
        'html_url' => 'https://github.com/octo-org/octo-repo',
    ]);

    GithubCardLink::create([
        'card_id' => $card->id,
        'github_repository_id' => $repository->id,
        'github_issue_id' => '54321',
        'issue_number' => 42,
        'issue_url' => 'https://github.com/octo-org/octo-repo/issues/42',
        'issue_state' => 'open',
        'last_synced_source' => 'github',
        'last_synced_at' => now(),
    ]);

    $event = GithubWebhookEvent::create([
        'github_repository_id' => $repository->id,
        'event_type' => 'pull_request',
        'delivery_id' => 'delivery-copilot-review-1',
        'payload' => [
            'action' => 'ready_for_review',
            'pull_request' => [
                'draft' => false,
                'body' => 'Fixes #42',
                'user' => ['login' => 'copilot-swe-agent[bot]'],
            ],
        ],
    ]);

    (new ProcessGithubWebhook($event))->handle(app(ActivityLogService::class));

    expect($card->fresh()->list_id)->toBe($review->id)
        ->and($event->fresh()->processed_at)->not()->toBeNull()
        ->and($card->activityLogs()->where('event_type', 'card_moved')->exists())->toBeTrue();
});
