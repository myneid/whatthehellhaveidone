<?php

use App\Models\Board;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function (User $user, int $id) {
    return $user->id === $id;
});

Broadcast::channel('board.{boardId}', function (User $user, int $boardId) {
    $board = Board::find($boardId);

    if (! $board) {
        return false;
    }

    return $user->id === $board->owner_id
        || $board->members()->where('user_id', $user->id)->exists();
});
