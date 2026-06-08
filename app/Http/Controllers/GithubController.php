<?php

namespace App\Http\Controllers;

use App\Jobs\CreateGithubIssueFromCard;
use App\Jobs\ImportGithubIssuesAsCards;
use App\Jobs\SyncCardWithGithub;
use App\Models\Board;
use App\Models\BoardGithubRepository;
use App\Models\Card;
use App\Models\GithubAccount;
use App\Models\User;
use App\Services\ActivityLogService;
use App\Services\GithubCardIssueService;
use App\Services\GithubPullRequestService;
use App\Services\GitHubService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use RuntimeException;

class GithubController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('github')
            ->scopes(['read:user', 'user:email', 'repo'])
            ->stateless()
            ->redirect();
    }

    public function callback(Request $request, GitHubService $github): RedirectResponse
    {
        $githubUser = Socialite::driver('github')->stateless()->user();

        $account = GithubAccount::updateOrCreate(
            ['github_user_id' => (string) $githubUser->getId()],
            [
                'user_id' => $request->user()->id,
                'username' => $githubUser->getNickname(),
                'avatar_url' => $githubUser->getAvatar(),
                'encrypted_access_token' => Crypt::encryptString($githubUser->token),
                'scopes' => $githubUser->approvedScopes ?? [],
                'revoked_at' => null,
            ]
        );

        $github->syncRepositories($account);

        return redirect()->route('dashboard')->with('success', 'GitHub account connected.');
    }

    public function syncRepos(Request $request, GithubAccount $githubAccount, GitHubService $github): RedirectResponse
    {
        abort_if($githubAccount->user_id !== $request->user()->id, 403);
        $github->syncRepositories($githubAccount);

        return back()->with('success', 'Repositories synced.');
    }

    public function destroy(Request $request, GithubAccount $githubAccount): RedirectResponse
    {
        abort_if($githubAccount->user_id !== $request->user()->id, 403);
        $githubAccount->update(['revoked_at' => now()]);

        return back()->with('success', 'GitHub account disconnected.');
    }

    public function repositories(Request $request, Board $board): JsonResponse
    {
        $this->authorize('update', $board);

        $accounts = $request->user()->githubAccounts()
            ->whereNull('revoked_at')
            ->with('repositories')
            ->get();

        return response()->json(['accounts' => $accounts]);
    }

    public function connectRepository(Request $request, Board $board, GitHubService $github): RedirectResponse
    {
        $this->authorize('update', $board);

        $request->validate([
            'github_repository_id' => ['required', 'exists:github_repositories,id'],
            'sync_direction' => ['nullable', 'in:github_to_board,board_to_github,two_way'],
        ]);

        BoardGithubRepository::firstOrCreate([
            'board_id' => $board->id,
            'github_repository_id' => $request->github_repository_id,
        ], [
            'sync_direction' => $request->sync_direction ?? 'two_way',
        ]);

        $repository = $board->githubRepositories()->find($request->github_repository_id);

        if ($repository) {
            try {
                $account = $github->getAccountForRepo($repository);
                $github->ensureRepositoryWebhook(
                    $account,
                    $repository,
                    route('webhooks.github'),
                );
            } catch (RuntimeException $e) {
                return back()->withErrors([
                    'github_repository_id' => "Repository connected, but webhook setup failed: {$e->getMessage()}",
                ]);
            }
        }

        return back()->with('success', 'Repository connected and GitHub webhook registered.');
    }

    public function disconnectRepository(
        Request $request,
        Board $board,
        BoardGithubRepository $boardGithubRepository,
        GitHubService $github,
    ): RedirectResponse {
        $this->authorize('update', $board);

        $repository = $boardGithubRepository->githubRepository;

        if ($repository && $repository->webhook_id) {
            $stillLinked = BoardGithubRepository::query()
                ->where('github_repository_id', '=', $repository->id)
                ->where('board_id', '!=', $board->id)
                ->exists();

            if (! $stillLinked) {
                try {
                    $account = $github->getAccountForRepo($repository);
                    $github->deleteRepositoryWebhook($account, $repository);
                } catch (RuntimeException) {
                    // Allow disconnect even if GitHub cleanup fails.
                }
            }
        }

        $boardGithubRepository->delete();

        return back();
    }

    public function createIssue(Request $request, Card $card): RedirectResponse
    {
        $this->authorize('update', $card);

        $request->validate(['github_repository_id' => ['required', 'exists:github_repositories,id']]);

        CreateGithubIssueFromCard::dispatch($card, $request->github_repository_id, $request->user());

        return back()->with('success', 'GitHub issue creation queued.');
    }

    public function linkIssue(Request $request, Card $card): RedirectResponse
    {
        $this->authorize('update', $card);

        $request->validate([
            'github_repository_id' => ['required', 'exists:github_repositories,id'],
            'issue_number' => ['required', 'integer'],
        ]);

        SyncCardWithGithub::dispatch($card, $request->github_repository_id, $request->issue_number, $request->user());

        return back()->with('success', 'GitHub issue linked.');
    }

    public function syncCard(Request $request, Card $card): RedirectResponse
    {
        $this->authorize('update', $card);

        if ($card->githubLink) {
            SyncCardWithGithub::dispatch($card, $card->githubLink->github_repository_id, $card->githubLink->issue_number, $request->user());
        }

        return back()->with('success', 'Sync queued.');
    }

    public function assignToCopilot(Request $request, Card $card, GitHubService $github): RedirectResponse
    {
        $this->authorize('update', $card);

        $link = $card->githubLink;
        if (! $link) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'No GitHub issue linked to this card.']);

            return back();
        }

        try {
            $repo = $link->githubRepository;
            $account = $github->getAccountForRepo($repo);
            $github->assignIssueToCopilot($account, $repo, $link->issue_number);
            $link->update(['request_copilot_review' => true]);
            $card->assignees()->detach();
        } catch (RuntimeException $e) {
            Inertia::flash('toast', ['type' => 'error', 'message' => $e->getMessage()]);

            return back();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Issue assigned to GitHub Copilot.']);

        return back();
    }

    public function assignWork(
        Request $request,
        Card $card,
        GithubCardIssueService $githubCardIssues,
        GitHubService $github,
        ActivityLogService $activityLog,
    ): RedirectResponse {
        $this->authorize('update', $card);

        $validated = $request->validate([
            'mode' => ['required', 'in:copilot,user'],
            'user_id' => ['required_if:mode,user', 'nullable', 'exists:users,id'],
        ]);

        try {
            $link = $githubCardIssues->ensureIssueForCardOrFail($card);
        } catch (RuntimeException $exception) {
            Inertia::flash('toast', ['type' => 'error', 'message' => $exception->getMessage()]);

            return back();
        }

        $board = $card->board()->firstOrFail();

        if ($validated['mode'] === 'user') {
            /** @var User $assignee */
            $assignee = User::query()->findOrFail($validated['user_id']);

            if (! $board->canAssignWorkTo($assignee)) {
                return back()->withErrors([
                    'user_id' => 'That user cannot be assigned work on this board.',
                ]);
            }

            $card->assignees()->sync([
                $assignee->id => ['assigned_by' => $request->user()->id],
            ]);

            $activityLog->log(
                $card,
                'user_assigned',
                new: ['user_id' => $assignee->id],
                actor: $request->user(),
            );

            $link->update(['request_copilot_review' => false]);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => "Work assigned to {$assignee->name}. Copilot review is disabled for this card.",
            ]);

            return back();
        }

        try {
            $repo = $link->githubRepository;
            $account = $github->getAccountForRepo($repo);
            $github->assignIssueToCopilot($account, $repo, $link->issue_number);
        } catch (RuntimeException $exception) {
            Inertia::flash('toast', ['type' => 'error', 'message' => $exception->getMessage()]);

            return back();
        }

        $link->update(['request_copilot_review' => true]);
        $card->assignees()->detach();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Work assigned to GitHub Copilot.']);

        return back();
    }

    public function resolvePullRequest(
        Request $request,
        Card $card,
        GithubPullRequestService $githubPullRequests,
    ): RedirectResponse {
        $this->authorize('update', $card);

        $validated = $request->validate([
            'action' => ['required', 'in:close,merge'],
        ]);

        $link = $card->githubLink;

        if (! $link || ! $link->pull_request_number) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'This card does not have a linked pull request.',
            ]);

            return back();
        }

        try {
            $link = $validated['action'] === 'merge'
                ? $githubPullRequests->merge($link)
                : $githubPullRequests->close($link);
        } catch (RuntimeException $exception) {
            Inertia::flash('toast', ['type' => 'error', 'message' => $exception->getMessage()]);

            return back();
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $validated['action'] === 'merge'
                ? "Pull request #{$link->pull_request_number} merged on GitHub."
                : "Pull request #{$link->pull_request_number} closed on GitHub.",
        ]);

        return back();
    }

    public function importIssues(Request $request, Board $board): RedirectResponse
    {
        $this->authorize('update', $board);

        $request->validate([
            'github_repository_id' => ['required', 'exists:github_repositories,id'],
            'state' => ['nullable', 'in:open,closed,all'],
        ]);

        ImportGithubIssuesAsCards::dispatch($board, $request->github_repository_id, $request->user(), $request->state ?? 'open');

        return back()->with('success', 'GitHub issues import queued.');
    }
}
