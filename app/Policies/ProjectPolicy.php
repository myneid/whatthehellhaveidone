<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use App\ProjectMemberRole;

class ProjectPolicy
{
    public function view(User $user, Project $project): bool
    {
        if ($user->is_super_admin) {
            return true;
        }

        return $project->owner_id === $user->id
            || $project->members()->where('user_id', $user->id)->exists();
    }

    public function update(User $user, Project $project): bool
    {
        if ($user->is_super_admin) {
            return true;
        }

        return $project->owner_id === $user->id
            || $project->members()->where('user_id', $user->id)->whereIn('role', ['owner', 'admin'])->exists();
    }

    public function delete(User $user, Project $project): bool
    {
        if ($user->is_super_admin) {
            return true;
        }

        return $project->owner_id === $user->id
            || $project->members()->where('user_id', $user->id)->where('role', 'owner')->exists();
    }

    public function manageMembers(User $user, Project $project): bool
    {
        return $this->update($user, $project);
    }
}
