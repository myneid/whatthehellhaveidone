<?php

namespace App\Policies;

use App\Models\Board;
use App\Models\User;

class BoardPolicy
{
    public function view(User $user, Board $board): bool
    {
        if ($user->is_super_admin) {
            return true;
        }

        if ($board->visibility === 'public') {
            return true;
        }

        if ($board->owner_id === $user->id) {
            return true;
        }

        if ($board->members()->where('user_id', $user->id)->exists()) {
            return true;
        }

        // Project members can view team boards
        if ($board->project_id && $board->visibility === 'team') {
            return $board->project->members()->where('user_id', $user->id)->exists();
        }

        return false;
    }

    public function update(User $user, Board $board): bool
    {
        if ($user->is_super_admin) {
            return true;
        }

        return $board->owner_id === $user->id
            || $board->members()->where('user_id', $user->id)->whereIn('role', ['admin'])->exists()
            || ($board->project_id && $board->project->members()->where('user_id', $user->id)->whereIn('role', ['owner', 'admin'])->exists());
    }

    public function delete(User $user, Board $board): bool
    {
        if ($user->is_super_admin) {
            return true;
        }

        return $board->owner_id === $user->id;
    }
}
