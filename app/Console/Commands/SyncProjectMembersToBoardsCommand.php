<?php

namespace App\Console\Commands;

use App\Models\Board;
use App\Models\Project;
use App\Services\SyncProjectMembersToBoardService;
use Illuminate\Console\Command;

class SyncProjectMembersToBoardsCommand extends Command
{
    protected $signature = 'boards:sync-project-members {project? : Project ID or slug to sync}';

    protected $description = 'Ensure project members are also board members for @mentions and work assignment';

    public function handle(SyncProjectMembersToBoardService $syncService): int
    {
        $projectArg = $this->argument('project');

        if ($projectArg) {
            $project = is_numeric($projectArg)
                ? Project::query()->findOrFail((int) $projectArg)
                : Project::query()->where('slug', $projectArg)->firstOrFail();

            $syncService->syncProject($project);
            $this->info("Synced boards for project \"{$project->name}\".");

            return self::SUCCESS;
        }

        $count = 0;

        Board::query()
            ->whereNotNull('project_id')
            ->whereNull('archived_at')
            ->orderBy('id')
            ->each(function (Board $board) use ($syncService, &$count): void {
                $syncService->sync($board);
                $count++;
            });

        $this->info("Synced {$count} board(s).");

        return self::SUCCESS;
    }
}
