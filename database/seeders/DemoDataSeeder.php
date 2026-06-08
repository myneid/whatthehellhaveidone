<?php

namespace Database\Seeders;

use App\BoardMemberRole;
use App\Models\Board;
use App\Models\Card;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    public const DEMO_USER_EMAIL = 'test@example.com';

    /** @var list<string> */
    private const DEFAULT_LISTS = ['Backlog', 'To Do', 'In Progress', 'Review', 'Done'];

    /** @var list<array{name: string, color: string}> */
    private const DEFAULT_LABELS = [
        ['name' => 'Bug', 'color' => '#ef4444'],
        ['name' => 'Feature', 'color' => '#3b82f6'],
        ['name' => 'Urgent', 'color' => '#f59e0b'],
        ['name' => 'Frontend', 'color' => '#8b5cf6'],
        ['name' => 'Backend', 'color' => '#10b981'],
    ];

    public function run(): void
    {
        $user = User::query()->where('email', self::DEMO_USER_EMAIL)->first();

        if ($user === null) {
            $this->command?->warn('User '.self::DEMO_USER_EMAIL.' not found. Register that account first, then run: php artisan db:seed --class=DemoDataSeeder');

            return;
        }

        $this->seedDemoProject($user, [
            'name' => 'Website Redesign',
            'slug' => 'demo-website-redesign',
            'description' => 'Marketing site refresh and landing pages.',
            'board' => [
                'name' => 'Sprint Board',
                'slug' => 'demo-website-sprint',
                'background_color' => '#1e3a5f',
            ],
            'cards' => [
                ['list' => 'Backlog', 'title' => 'Audit current homepage', 'labels' => ['Feature'], 'priority' => 'medium'],
                ['list' => 'To Do', 'title' => 'Wireframe pricing page', 'labels' => ['Frontend', 'Feature'], 'priority' => 'high', 'due_days' => 5],
                ['list' => 'In Progress', 'title' => 'Implement hero section', 'labels' => ['Frontend'], 'priority' => 'high', 'assign' => true],
                ['list' => 'Review', 'title' => 'Accessibility pass on nav', 'labels' => ['Bug', 'Urgent'], 'priority' => 'urgent'],
                ['list' => 'Done', 'title' => 'Set up analytics events', 'labels' => ['Backend'], 'priority' => 'low', 'completed' => true],
            ],
        ]);

        $this->seedDemoProject($user, [
            'name' => 'Mobile App',
            'slug' => 'demo-mobile-app',
            'description' => 'iOS and Android companion app.',
            'board' => [
                'name' => 'Release Train',
                'slug' => 'demo-mobile-release',
                'background_color' => '#14532d',
            ],
            'cards' => [
                ['list' => 'Backlog', 'title' => 'Push notification copy', 'labels' => ['Feature'], 'priority' => 'low'],
                ['list' => 'To Do', 'title' => 'Offline sync for boards', 'labels' => ['Backend', 'Feature'], 'priority' => 'high'],
                ['list' => 'In Progress', 'title' => 'Biometric login', 'labels' => ['Backend', 'Urgent'], 'priority' => 'urgent', 'assign' => true],
                ['list' => 'Done', 'title' => 'App Store screenshots', 'labels' => ['Frontend'], 'priority' => 'medium', 'completed' => true],
            ],
        ]);

        $this->command?->info("Demo data seeded for {$user->email}. Open your dashboard or boards to explore.");
    }

    /**
     * @param  array{
     *     name: string,
     *     slug: string,
     *     description: string,
     *     board: array{name: string, slug: string, background_color: string},
     *     cards: list<array{
     *         list: string,
     *         title: string,
     *         labels: list<string>,
     *         priority: string,
     *         due_days?: int,
     *         assign?: bool,
     *         completed?: bool
     *     }>
     * }  $definition
     */
    private function seedDemoProject(User $user, array $definition): void
    {
        $project = Project::query()->updateOrCreate(
            ['slug' => $definition['slug']],
            [
                'owner_id' => $user->id,
                'name' => $definition['name'],
                'description' => $definition['description'],
            ],
        );

        $project->members()->firstOrCreate(
            ['user_id' => $user->id],
            ['role' => 'owner'],
        );

        $board = Board::query()->updateOrCreate(
            [
                'project_id' => $project->id,
                'slug' => $definition['board']['slug'],
            ],
            [
                'owner_id' => $user->id,
                'name' => $definition['board']['name'],
                'visibility' => 'team',
                'background_color' => $definition['board']['background_color'],
            ],
        );

        $board->members()->firstOrCreate(
            ['user_id' => $user->id],
            ['role' => BoardMemberRole::Admin->value],
        );

        $listIds = $this->ensureBoardLists($board);
        $labelIds = $this->ensureBoardLabels($board);

        if ($board->cards()->exists()) {
            return;
        }

        foreach ($definition['cards'] as $index => $cardData) {
            $listId = $listIds[$cardData['list']] ?? null;

            if ($listId === null) {
                continue;
            }

            $card = Card::create([
                'board_id' => $board->id,
                'list_id' => $listId,
                'creator_id' => $user->id,
                'title' => $cardData['title'],
                'position' => $index + 1,
                'priority' => $cardData['priority'],
                'due_at' => isset($cardData['due_days'])
                    ? now()->addDays($cardData['due_days'])
                    : null,
                'completed_at' => ($cardData['completed'] ?? false) ? now()->subDay() : null,
            ]);

            $labelKeys = collect($cardData['labels'])
                ->map(fn (string $name): ?int => $labelIds[$name] ?? null)
                ->filter()
                ->values()
                ->all();

            if ($labelKeys !== []) {
                $card->labels()->attach($labelKeys);
            }

            if ($cardData['assign'] ?? false) {
                $card->assignees()->attach($user->id, ['assigned_by' => $user->id]);
            }
        }
    }

    /**
     * @return array<string, int>
     */
    private function ensureBoardLists(Board $board): array
    {
        $listIds = [];

        foreach (self::DEFAULT_LISTS as $index => $name) {
            $list = $board->lists()->firstOrCreate(
                ['name' => $name],
                ['position' => $index],
            );

            $listIds[$name] = $list->id;

            if ($name === 'Review' && $board->copilot_done_list_id === null) {
                $board->update(['copilot_done_list_id' => $list->id]);
            }

            if ($name === 'Done' && $board->done_list_id === null) {
                $board->update(['done_list_id' => $list->id]);
            }

            if ($name === 'To Do' && $board->todo_list_id === null) {
                $board->update(['todo_list_id' => $list->id]);
            }

            if ($name === 'In Progress' && $board->work_start_list_id === null) {
                $board->update(['work_start_list_id' => $list->id]);
            }
        }

        return $listIds;
    }

    /**
     * @return array<string, int>
     */
    private function ensureBoardLabels(Board $board): array
    {
        $labelIds = [];

        foreach (self::DEFAULT_LABELS as $definition) {
            $label = $board->labels()->firstOrCreate(
                ['name' => $definition['name']],
                ['color' => $definition['color']],
            );

            $labelIds[$definition['name']] = $label->id;
        }

        return $labelIds;
    }
}
