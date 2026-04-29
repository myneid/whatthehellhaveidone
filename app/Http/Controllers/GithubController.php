<?php

namespace App\Http\Controllers;

use App\Jobs\CreateGithubIssueFromCard;
use App\Jobs\ImportGithubIssuesAsCards;
use App\Jobs\SyncCardWithGithub;
use App\Models\Board;
use App\Models\BoardGithubRepository;
use App\Models\Card;
use App\Models\GithubAccount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Laravel\Socialite\Facades\Socialite;

class GithubController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('github')
            ->scopes(['read:user', 'user:email', 'public_repo'])
            ->stateless()
            ->redirect();
    }

    public function callback(Request $request): RedirectResponse
    {
        $githubUser = Socialite::driver('github')->stateless()->user();

        GithubAccount::updateOrCreate(
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

        return redirect()->route('dashboard')->with('success', 'GitHub account connected.');
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

    public function connectRepository(Request $request, Board $board): RedirectResponse
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

        return back()->with('success', 'Repository connected.');
    }

    public function disconnectRepository(Request $request, Board $board, BoardGithubRepository $boardGithubRepository): RedirectResponse
    {
        $this->authorize('update', $board);
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
