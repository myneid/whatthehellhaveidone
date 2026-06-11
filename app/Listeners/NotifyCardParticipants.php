<?php

namespace App\Listeners;

use App\Events\CardAttachmentAdded;
use App\Events\CardCommented;
use App\Events\CardMoved;
use App\Models\Card;
use App\Models\User;
use App\Notifications\CardActivityNotification;
use Illuminate\Support\Facades\Auth;

class NotifyCardParticipants
{
    public function handle(CardCommented|CardMoved|CardAttachmentAdded $event): void
    {
        $card = $event->card;
        $actor = Auth::user();
        $actorName = $actor?->name ?? 'System';

        if ($event instanceof CardCommented) {
            $event->comment->loadMissing('user');
            $actor = $event->comment->user;
            $actorName = $event->comment->user->name;
        } elseif ($event instanceof CardAttachmentAdded) {
            $event->attachment->loadMissing('user');
            $actor = $event->attachment->user;
            $actorName = $event->attachment->user->name;
        } elseif ($event instanceof CardMoved) {
            $actor = $event->actor;
            $actorName = $event->actor?->name ?? $event->actorName ?? 'System';
        }

        $cardReference = $this->cardReference($card);

        if ($event instanceof CardCommented) {
            $action = 'commented';
            $detail = "{$actorName} commented on {$cardReference}";
        } elseif ($event instanceof CardAttachmentAdded) {
            $isImage = str_starts_with((string) $event->attachment->mime_type, 'image/');

            $action = 'attachment_added';
            $detail = "{$actorName} added ".($isImage ? 'an image' : 'an attachment')." to {$cardReference}";
        } else {
            $card->loadMissing('board.lists');
            $fromList = $card->board?->lists->firstWhere('id', $event->fromListId);
            $toList = $card->list;
            $action = 'moved';
            $detail = ($fromList?->name ?? '?').' → '.($toList?->name ?? '?');
        }

        $card->loadMissing('board');

        if (! $card->board) {
            return;
        }

        $card->board->mentionableUsers()
            ->filter(fn (User $user): bool => $user->id !== $actor?->id)
            ->each(fn (User $user) => $user->notify(
                new CardActivityNotification($card, $action, $actor, $actorName, $detail),
            ));
    }

    private function cardReference(Card $card): string
    {
        return '#'.$card->number.' "'.$card->title.'"';
    }
}
