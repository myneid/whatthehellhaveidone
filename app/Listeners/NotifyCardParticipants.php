<?php

namespace App\Listeners;

use App\Events\CardAttachmentAdded;
use App\Events\CardCommented;
use App\Events\CardMoved;
use App\Notifications\CardActivityNotification;
use Illuminate\Support\Facades\Auth;

class NotifyCardParticipants
{
    public function handle(CardCommented|CardMoved|CardAttachmentAdded $event): void
    {
        $card = $event->card;
        $actor = match (true) {
            $event instanceof CardCommented => $event->comment->user,
            $event instanceof CardAttachmentAdded => $event->attachment->user,
            default => Auth::user(),
        };

        if ($event instanceof CardCommented) {
            $action = 'commented';
            $detail = $event->comment->user->name.' commented on "'.$card->title.'"';
        } elseif ($event instanceof CardAttachmentAdded) {
            $isImage = str_starts_with((string) $event->attachment->mime_type, 'image/');

            $action = 'attachment_added';
            $detail = $event->attachment->user->name.' added '.($isImage ? 'an image' : 'an attachment').' to "'.$card->title.'"';
        } else {
            $card->loadMissing('board.lists');
            $fromList = $card->board?->lists->firstWhere('id', $event->fromListId);
            $toList = $card->list;
            $action = 'moved';
            $detail = ($fromList?->name ?? '?').' → '.($toList?->name ?? '?');
        }

        $card->loadMissing(['board.owner', 'board.users']);

        $recipients = collect([$card->board?->owner])
            ->merge($card->board?->users ?? collect())
            ->filter(fn ($user) => $user && $user->id !== $actor?->id)
            ->unique('id')
            ->values();

        $recipients->each(
            fn ($user) => $user->notify(new CardActivityNotification($card, $action, $actor, $detail))
        );
    }
}
