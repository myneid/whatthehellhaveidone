<?php

namespace App\Listeners;

use App\Events\CardAttachmentAdded;
use App\Events\CardCommented;
use App\Events\CardCompleted;
use App\Events\CardCreated;
use App\Events\CardMoved;
use App\Jobs\SendDiscordNotification;
use App\Models\Card;
use Illuminate\Support\Str;

class SendDiscordNotificationForCardEvent
{
    public function handle(object $event): void
    {
        $card = $event->card ?? null;

        if (! $card instanceof Card) {
            return;
        }

        $card->loadMissing('board');
        $webhook = $card->board?->discordWebhook;

        if (! $webhook || ! $webhook->enabled) {
            return;
        }

        $eventType = match (true) {
            $event instanceof CardCreated => 'card.created',
            $event instanceof CardMoved => 'card.moved',
            $event instanceof CardCompleted => 'card.completed',
            $event instanceof CardCommented => 'card.commented',
            $event instanceof CardAttachmentAdded => 'card.attachment_added',
            default => null,
        };

        if (! $eventType) {
            return;
        }

        SendDiscordNotification::dispatch($webhook, $card, $eventType, $this->contextFor($event));
    }

    /** @return array<string, mixed> */
    private function contextFor(object $event): array
    {
        return match (true) {
            $event instanceof CardCommented => [
                'actor_name' => $event->comment->loadMissing('user')->user->name,
                'comment_excerpt' => Str::limit($event->comment->body, 240),
            ],
            $event instanceof CardAttachmentAdded => [
                'actor_name' => $event->attachment->loadMissing('user')->user->name,
                'filename' => $event->attachment->filename,
                'is_image' => str_starts_with((string) $event->attachment->mime_type, 'image/'),
            ],
            $event instanceof CardMoved => [
                'actor_name' => $event->actor?->name ?? $event->actorName ?? 'System',
            ],
            default => [],
        };
    }
}
