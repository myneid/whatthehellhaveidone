<?php

namespace App\Services;

use App\Jobs\SendDiscordNotification;
use App\Models\Board;
use App\Models\Card;

class DiscordNotificationService
{
    public function notify(Board $board, string $eventType, array $data): void
    {
        $webhook = $board->discordWebhook;

        if (! $webhook || ! $webhook->enabled) {
            return;
        }

        $eventSettings = $webhook->event_settings ?? [];
        if (isset($eventSettings[$eventType]) && $eventSettings[$eventType] === false) {
            return;
        }

        SendDiscordNotification::dispatch($board->id, $eventType, $data);
    }

    public function buildCardMovedPayload(Card $card, string $fromList): array
    {
        return [
            'event' => 'card_moved',
            'board' => $card->board->name,
            'card' => $card->title,
            'from' => $fromList,
            'to' => $card->list->name,
            'actor' => request()->user()?->name,
            'card_url' => route('cards.show', $card),
        ];
    }

    public function formatMessage(string $eventType, array $data): array
    {
        $emoji = match ($eventType) {
            'card_created' => '📌',
            'card_moved' => '➡️',
            'card_assigned' => '👤',
            'card_completed' => '✅',
            'card_commented' => '💬',
            'card_attachment_added' => '📎',
            'github_issue_linked' => '🐙',
            'github_synced' => '🔄',
            default => '📢',
        };

        $lines = ["{$emoji} **".ucwords(str_replace('_', ' ', $eventType)).'**'];
        foreach ($data as $key => $value) {
            if ($value && $key !== 'event') {
                $lines[] = '**'.ucfirst(str_replace('_', ' ', $key)).":** {$value}";
            }
        }

        return [
            'content' => implode("\n", $lines),
        ];
    }
}
