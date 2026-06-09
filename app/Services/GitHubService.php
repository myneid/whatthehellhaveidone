<?php

namespace App\Services;

use App\Models\GithubAccount;
use App\Models\GithubRepository;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class GitHubService
{
    private const API_BASE = 'https://api.github.com';

    private const COPILOT_AGENT_ASSIGNEE = 'copilot-swe-agent[bot]';

    private const COPILOT_PR_REVIEWER = 'copilot-pull-request-reviewer[bot]';

    /** @var list<string> */
    private const REPOSITORY_WEBHOOK_EVENTS = ['issues', 'pull_request', 'ping'];

    public function clientFor(GithubAccount $account): PendingRequest
    {
        $token = Crypt::decryptString($account->encrypted_access_token);

        return Http::withToken($token)
            ->withHeaders(['Accept' => 'application/vnd.github+json', 'X-GitHub-Api-Version' => '2022-11-28'])
            ->baseUrl(self::API_BASE);
    }

    public function syncRepositories(GithubAccount $account): void
    {
        $repos = [];
        $page = 1;

        do {
            $response = $this->clientFor($account)
                ->get('/user/repos', ['per_page' => 100, 'page' => $page, 'type' => 'all', 'sort' => 'pushed']);

            $this->assertOk($response, 'fetch repositories');
            $batch = $response->json();
            $repos = array_merge($repos, $batch);
            $page++;
        } while (count($batch) === 100);

        foreach ($repos as $repo) {
            GithubRepository::updateOrCreate(
                ['github_account_id' => $account->id, 'github_repo_id' => (string) $repo['id']],
                [
                    'owner' => $repo['owner']['login'],
                    'name' => $repo['name'],
                    'full_name' => $repo['full_name'],
                    'private' => $repo['private'],
                    'html_url' => $repo['html_url'],
                ],
            );
        }
    }

    public function getIssues(GithubAccount $account, GithubRepository $repo, string $state = 'open'): array
    {
        $issues = [];
        $page = 1;

        do {
            $response = $this->clientFor($account)
                ->get("/repos/{$repo->full_name}/issues", ['state' => $state, 'per_page' => 100, 'page' => $page, 'filter' => 'all']);

            $this->assertOk($response, "fetch issues from {$repo->full_name}");
            $batch = $response->json();
            // GitHub issues endpoint also returns pull requests; skip them
            $batch = array_filter($batch, fn ($i) => ! isset($i['pull_request']));
            $issues = array_merge($issues, array_values($batch));
            $page++;
        } while (count($response->json()) === 100);

        return $issues;
    }

    public function getIssue(GithubAccount $account, GithubRepository $repo, int $number): array
    {
        $response = $this->clientFor($account)
            ->get("/repos/{$repo->full_name}/issues/{$number}");

        $this->assertOk($response, "get issue #{$number}");

        return $response->json();
    }

    public function createIssue(GithubAccount $account, GithubRepository $repo, string $title, ?string $body = null, array $labels = []): array
    {
        $payload = array_filter(['title' => $title, 'body' => $body, 'labels' => $labels ?: null]);

        $response = $this->clientFor($account)
            ->post("/repos/{$repo->full_name}/issues", $payload);

        $this->assertOk($response, "create issue in {$repo->full_name}");

        return $response->json();
    }

    public function updateIssue(GithubAccount $account, GithubRepository $repo, int $number, array $data): array
    {
        $response = $this->clientFor($account)
            ->patch("/repos/{$repo->full_name}/issues/{$number}", $data);

        $this->assertOk($response, "update issue #{$number}");

        return $response->json();
    }

    public function assignIssueToCopilot(GithubAccount $account, GithubRepository $repo, int $number): array
    {
        $response = $this->clientFor($account)
            ->post("/repos/{$repo->full_name}/issues/{$number}/assignees", [
                'assignees' => [self::COPILOT_AGENT_ASSIGNEE],
                'agent_assignment' => [
                    'target_repo' => $repo->full_name,
                ],
            ]);

        $this->assertOk($response, "assign issue #{$number} to Copilot");

        return $response->json();
    }

    public function requestCopilotCodeReview(GithubAccount $account, GithubRepository $repo, int $pullNumber): array
    {
        $response = $this->clientFor($account)
            ->post("/repos/{$repo->full_name}/pulls/{$pullNumber}/requested_reviewers", [
                'reviewers' => [self::COPILOT_PR_REVIEWER],
            ]);

        $this->assertOk($response, "request Copilot review on PR #{$pullNumber}");

        return $response->json();
    }

    public function closePullRequest(GithubAccount $account, GithubRepository $repo, int $pullNumber): array
    {
        $response = $this->clientFor($account)
            ->patch("/repos/{$repo->full_name}/pulls/{$pullNumber}", [
                'state' => 'closed',
            ]);

        $this->assertOk($response, "close pull request #{$pullNumber}");

        return $response->json();
    }

    public function mergePullRequest(GithubAccount $account, GithubRepository $repo, int $pullNumber): array
    {
        $response = $this->clientFor($account)
            ->put("/repos/{$repo->full_name}/pulls/{$pullNumber}/merge");

        $this->assertOk($response, "merge pull request #{$pullNumber}");

        return $response->json();
    }

    public function ensureRepositoryWebhook(GithubAccount $account, GithubRepository $repo, string $webhookUrl): GithubRepository
    {
        if ($repo->webhook_id && $repo->webhook_secret) {
            return $repo;
        }

        $secret = Str::random(40);

        $response = $this->clientFor($account)
            ->post("/repos/{$repo->full_name}/hooks", [
                'name' => 'web',
                'active' => true,
                'events' => self::REPOSITORY_WEBHOOK_EVENTS,
                'config' => [
                    'url' => $webhookUrl,
                    'content_type' => 'json',
                    'secret' => $secret,
                ],
            ]);

        $this->assertOk($response, "register webhook for {$repo->full_name}");

        $hook = $response->json();

        $repo->update([
            'webhook_id' => (string) ($hook['id'] ?? ''),
            'webhook_secret' => $secret,
        ]);

        return $repo->fresh();
    }

    public function deleteRepositoryWebhook(GithubAccount $account, GithubRepository $repo): void
    {
        if (! $repo->webhook_id) {
            return;
        }

        $response = $this->clientFor($account)
            ->delete("/repos/{$repo->full_name}/hooks/{$repo->webhook_id}");

        if ($response->status() !== 404) {
            $this->assertOk($response, "delete webhook for {$repo->full_name}");
        }

        $repo->update([
            'webhook_id' => null,
            'webhook_secret' => null,
        ]);
    }

    public function getAccountForRepo(GithubRepository $repo): GithubAccount
    {
        $account = $repo->githubAccount;
        if (! $account || $account->revoked_at) {
            throw new RuntimeException("No active GitHub account found for repository {$repo->full_name}.");
        }

        return $account;
    }

    public function getMarkdownTree(GithubAccount $account, GithubRepository $repo): array
    {
        $response = $this->clientFor($account)
            ->get("/repos/{$repo->full_name}/git/trees/HEAD", ['recursive' => 1]);

        if ($response->status() === 404) {
            return [];
        }

        $this->assertOk($response, "fetch file tree for {$repo->full_name}");

        return collect($response->json('tree', []))
            ->filter(fn ($item) => $item['type'] === 'blob' && str_ends_with($item['path'], '.md'))
            ->map(fn ($item) => ['path' => $item['path'], 'size' => $item['size'] ?? 0])
            ->values()
            ->toArray();
    }

    public function getFileContent(GithubAccount $account, GithubRepository $repo, string $path): string
    {
        $response = $this->clientFor($account)
            ->get("/repos/{$repo->full_name}/contents/{$path}");

        $this->assertOk($response, "fetch file {$path} from {$repo->full_name}");

        return base64_decode(str_replace(["\n", "\r"], '', $response->json('content', '')));
    }

    private function assertOk(Response $response, string $action): void
    {
        if ($response->failed()) {
            $message = $response->json('message') ?? $response->body();
            throw new RuntimeException("GitHub API failed to {$action}: {$message} (HTTP {$response->status()})");
        }
    }
}
