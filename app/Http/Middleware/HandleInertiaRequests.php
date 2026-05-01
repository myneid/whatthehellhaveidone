<?php

namespace App\Http\Middleware;

use App\Models\Board;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
                'unreadNotificationsCount' => fn () => $request->user()?->unreadNotifications()->count() ?? 0,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'navigation' => fn () => $this->sidebarNavigation($request),
            'flash' => [
                'token' => $request->session()->get('token'),
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }

    /**
     * Build sidebar navigation data for boards and projects.
     *
     * @return array<string, mixed>
     */
    private function sidebarNavigation(Request $request): array
    {
        $user = $request->user();

        if (! $user) {
            return [
                'standaloneBoards' => [],
                'projects' => [],
            ];
        }

        $standaloneBoards = $user->boards()
            ->select('boards.id', 'boards.name', 'boards.slug')
            ->whereNull('boards.project_id')
            ->whereNull('boards.archived_at')
            ->orderBy('boards.name')
            ->get()
            ->map(fn (Board $board): array => [
                'id' => $board->id,
                'name' => $board->name,
                'href' => route('boards.show', $board),
            ])
            ->values();

        $projects = $user->projects()
            ->select('projects.id', 'projects.name', 'projects.slug')
            ->whereNull('projects.archived_at')
            ->with([
                'boards' => fn ($query) => $query
                    ->select('id', 'project_id', 'name', 'slug')
                    ->whereNull('archived_at')
                    ->orderBy('name'),
            ])
            ->orderBy('projects.name')
            ->get()
            ->map(fn (Project $project): array => [
                'id' => $project->id,
                'name' => $project->name,
                'href' => route('projects.show', $project),
                'documentsHref' => route('projects.documents.index', $project),
                'boards' => $project->boards
                    ->map(fn (Board $board): array => [
                        'id' => $board->id,
                        'name' => $board->name,
                        'href' => route('boards.show', $board),
                    ])
                    ->values(),
            ])
            ->values();

        return [
            'standaloneBoards' => $standaloneBoards,
            'projects' => $projects,
        ];
    }
}
