<?php

use App\Jobs\SendDiscordNotification;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\Card;
use App\Models\DiscordWebhook;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;

uses(RefreshDatabase::class);

it('sends card event notifications as WHHID bot', function (): void {
    Http::fake();

    $user = User::factory()->create();

    $board = Board::create([
        'owner_id' => $user->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-job-notify',
        'visibility' => 'team',
    ]);

    $list = BoardList::create([
        'board_id' => $board->id,
        'name' => 'To Do',
        'position' => 1,
    ]);

    $card = Card::create([
        'board_id' => $board->id,
        'list_id' => $list->id,
        'creator_id' => $user->id,
        'title' => 'Ship Discord update',
        'position' => 1,
        'priority' => 'medium',
    ]);

    $webhook = DiscordWebhook::create([
        'board_id' => $board->id,
        'name' => 'Discord',
        'encrypted_webhook_url' => Crypt::encryptString('https://discord.com/api/webhooks/test-job'),
        'enabled' => true,
        'event_settings' => ['card.created'],
    ]);

    $job = new SendDiscordNotification($webhook, $card, 'card.created');
    $job->handle();

    Http::assertSent(function ($request): bool {
        $payload = $request->data();

        return $request->url() === 'https://discord.com/api/webhooks/test-job'
            && ($payload['username'] ?? null) === 'WHHID bot'
            && isset($payload['embeds'][0]['title'])
            && $payload['embeds'][0]['title'] === '🟢 Card Created';
    });
});
