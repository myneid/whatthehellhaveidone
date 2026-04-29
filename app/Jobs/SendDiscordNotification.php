<?php

namespace App\Jobs;

use App\Models\Card;
use App\Models\DiscordWebhook;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Throwable;

class SendDiscordNotification implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(
        public readonly DiscordWebhook $webhook,
        public readonly Card $card,
        public readonly string $eventType,
    ) {}

    public function handle(): void
    {
        if (! $this->webhook->enabled) {
            return;
        }

        $allowedEvents = $this->webhook->event_settings ?? ['card.created', 'card.moved'];
        if (! in_array($this->eventType, $allowedEvents, true)) {
            return;
        }

        $url = Crypt::decryptString($this->webhook->encrypted_webhook_url);
        $payload = $this->buildPayload();

        try {
            $response = Http::timeout(10)->post($url, $payload);

            if ($response->failed()) {
                $this->webhook->update(['last_failed_at' => now()]);

                $this->fail("Discord responded with HTTP {$response->status()}");

                return;
            }

            $this->webhook->update(['last_success_at' => now()]);
        } catch (Throwable $e) {
            $this->webhook->update(['last_failed_at' => now()]);
            throw $e;
        }
    }

    private function buildPayload(): array
    {
        $card = $this->card->loadMissing(['list', 'board']);
        $boardName = $card->board->name ?? 'Unknown Board';
        $listName = $card->list->name ?? 'Unknown List';
        $cardUrl = url("/boards/{$card->board->slug}/cards/{$card->id}");

        $color = match ($this->eventType) {
            'card.created' => 0x22C55E,
            'card.moved' => 0x3B82F6,
            'card.completed' => 0xA855F7,
            'card.commented' => 0xF97316,
            default => 0x6B7280,
        };

        $title = match ($this->eventType) {
            'card.created' => '🟢 Card Created',
            'card.moved' => '🔵 Card Moved',
            'card.completed' => '✅ Card Completed',
            'card.commented' => '💬 New Comment',
            default => ucfirst(str_replace('.', ' ', $this->eventType)),
        };

        $description = match ($this->eventType) {
            'card.created' => "**[{$card->title}]({$cardUrl})** was added to **{$listName}**",
            'card.moved' => "**[{$card->title}]({$cardUrl})** was moved to **{$listName}**",
            'card.completed' => "**[{$card->title}]({$cardUrl})** was completed",
            'card.commented' => "A comment was added to **[{$card->title}]({$cardUrl})**",
            default => "**[{$card->title}]({$cardUrl})** — {$this->eventType}",
        };

        return [
            'embeds' => [[
                'title' => $title,
                'description' => $description,
                'color' => $color,
                'footer' => ['text' => $boardName],
                'timestamp' => now()->toIso8601String(),
            ]],
        ];
    }
}
