<?php

namespace App\Policies;

use App\Models\Card;
use App\Models\User;

class CardPolicy
{
    public function view(User $user, Card $card): bool
    {
        return app(BoardPolicy::class)->view($user, $card->board);
    }

    public function update(User $user, Card $card): bool
    {
        if ($user->is_super_admin) {
            return true;
        }

        $board = $card->board;

        // Viewers cannot edit
        $memberRole = $board->members()->where('user_id', $user->id)->value('role');
        if ($memberRole === 'viewer') {
            return false;
        }

        return app(BoardPolicy::class)->view($user, $board);
    }

    public function delete(User $user, Card $card): bool
    {
        return app(BoardPolicy::class)->update($user, $card->board)
            || $card->creator_id === $user->id;
    }
}
