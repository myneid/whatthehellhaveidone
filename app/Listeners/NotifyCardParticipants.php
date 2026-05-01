<?php

namespace App\Listeners;

use App\Events\CardCommented;
use App\Events\CardMoved;
use App\Models\User;
use App\Notifications\CardActivityNotification;
use Illuminate\Support\Facades\Auth;

class NotifyCardParticipants
{
    public function handle(CardCommented|CardMoved $event): void
    {
        $card = $event->card;
        $actor = Auth::user();

        if ($event instanceof CardCommented) {
            $action = 'commented';
            $detail = $event->comment->user->name.' commented on "'.$card->title.'"';
        } else {
            $card->loadMissing('board.lists');
            $fromList = $card->board?->lists->firstWhere('id', $event->fromListId);
            $toList = $card->list;
            $action = 'moved';
            $detail = ($fromList?->name ?? '?').' → '.($toList?->name ?? '?');
        }

        $card->loadMissing(['creator', 'comments.user']);

        $participantIds = collect([$card->creator_id])
            ->merge($card->comments->pluck('user_id'))
            ->unique()
            ->filter(fn ($id) => $id && $id !== $actor?->id)
            ->values();

        User::whereIn('id', $participantIds)->get()->each(
            fn (User $user) => $user->notify(new CardActivityNotification($card, $action, $actor, $detail))
        );
    }
}
