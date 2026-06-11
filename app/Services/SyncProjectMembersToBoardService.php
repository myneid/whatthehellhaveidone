<?php

namespace App\Services;

use App\BoardMemberRole;
use App\Models\Board;
use App\Models\BoardMember;
use App\Models\Project;
use App\Models\ProjectMember;

class SyncProjectMembersToBoardService
{
    public function syncProject(Project $project): void
    {
        Board::query()
            ->where('project_id', $project->id)
            ->whereNull('archived_at')
            ->get()
            ->each(fn (Board $board) => $this->sync($board));
    }

    public function sync(Board $board): void
    {
        if (! $board->project_id) {
            return;
        }

        ProjectMember::query()
            ->where('project_id', $board->project_id)
            ->with('user')
            ->get()
            ->each(function (ProjectMember $projectMember) use ($board): void {
                if (! $projectMember->user) {
                    return;
                }

                BoardMember::firstOrCreate(
                    [
                        'board_id' => $board->id,
                        'user_id' => $projectMember->user_id,
                    ],
                    [
                        'role' => $this->mapProjectRoleToBoardRole($projectMember->role),
                    ],
                );
            });

        $board->unsetRelation('members');
    }

    private function mapProjectRoleToBoardRole(string $projectRole): string
    {
        return match ($projectRole) {
            'owner', 'admin' => BoardMemberRole::Admin->value,
            'viewer' => BoardMemberRole::Viewer->value,
            default => BoardMemberRole::Member->value,
        };
    }
}
