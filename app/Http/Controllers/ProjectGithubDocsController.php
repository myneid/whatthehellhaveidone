<?php

namespace App\Http\Controllers;

use App\Models\GithubRepository;
use App\Models\Project;
use App\Services\GitHubService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ProjectGithubDocsController extends Controller
{
    public function __construct(private GitHubService $github) {}

    public function show(Request $request, Project $project, GithubRepository $repository): Response
    {
        $this->authorize('view', $project);

        abort_unless(
            $project->boards()->whereHas('githubRepositories', fn ($q) => $q->where('github_repositories.id', $repository->id))->exists(),
            404
        );

        $account = $this->github->getAccountForRepo($repository);

        $files = Cache::remember(
            "github-md-tree:{$repository->id}",
            600,
            fn () => $this->github->getMarkdownTree($account, $repository)
        );

        $selectedFile = null;
        $path = $request->query('path');

        if ($path) {
            abort_unless(collect($files)->contains('path', $path), 404);
            $selectedFile = [
                'path' => $path,
                'content' => $this->github->getFileContent($account, $repository, $path),
            ];
        }

        return Inertia::render('projects/github-docs/show', [
            'project' => $project,
            'repository' => $repository->only(['id', 'name', 'full_name', 'html_url']),
            'files' => $files,
            'selectedFile' => $selectedFile,
        ]);
    }
}
