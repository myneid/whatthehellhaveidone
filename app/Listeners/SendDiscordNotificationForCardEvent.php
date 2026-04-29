<?php

namespace App\Listeners;

use App\Events\CardCommented;
use App\Events\CardCompleted;
use App\Events\CardCreated;
use App\Events\CardMoved;
use App\Jobs\SendDiscordNotification;
use App\Models\Card;

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
            default => null,
        };

        if (! $eventType) {
            return;
        }

        SendDiscordNotification::dispatch($webhook, $card, $eventType);
    }
}
