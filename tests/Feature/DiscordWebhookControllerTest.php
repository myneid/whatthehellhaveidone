<?php

use App\Models\Board;
use App\Models\DiscordWebhook;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

it('updates a discord webhook without requiring webhook url', function (): void {
    /** @var User $user */
    $user = User::factory()->create();

    $board = Board::create([
        'owner_id' => $user->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-discord',
        'visibility' => 'team',
    ]);

    $webhook = DiscordWebhook::create([
        'board_id' => $board->id,
        'name' => 'Discord',
        'encrypted_webhook_url' => Crypt::encryptString('https://discord.com/api/webhooks/original'),
        'enabled' => true,
        'event_settings' => ['card.created'],
    ]);

    $response = actingAs($user)
        ->from(route('boards.show', $board))
        ->put(route('discord.update', $board), [
            'name' => 'Engineering Alerts',
            'webhook_url' => '',
            'events' => ['card.created', 'card.moved'],
        ]);

    $response->assertRedirect(route('boards.show', $board));
    $response->assertSessionHasNoErrors();

    expect($webhook->fresh())
        ->name->toBe('Engineering Alerts')
        ->event_settings->toBe(['card.created', 'card.moved'])
        ->enabled->toBeTrue();

    expect(Crypt::decryptString($webhook->fresh()->encrypted_webhook_url))
        ->toBe('https://discord.com/api/webhooks/original');
});

it('defaults discord webhook events to include comments and attachments', function (): void {
    /** @var User $user */
    $user = User::factory()->create();

    $board = Board::create([
        'owner_id' => $user->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-discord-defaults',
        'visibility' => 'team',
    ]);

    $response = actingAs($user)
        ->from(route('boards.show', $board))
        ->post(route('discord.store', $board), [
            'webhook_url' => 'https://discord.com/api/webhooks/defaults',
        ]);

    $response->assertRedirect(route('boards.show', $board));
    $response->assertSessionHasNoErrors();

    expect($board->fresh()->discordWebhook?->event_settings)->toBe([
        'card.created',
        'card.moved',
        'card.commented',
        'card.attachment_added',
    ]);
});

it('sends test webhook messages as WHHID bot', function (): void {
    Http::fake();

    /** @var User $user */
    $user = User::factory()->create();

    $board = Board::create([
        'owner_id' => $user->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-discord-test',
        'visibility' => 'team',
    ]);

    DiscordWebhook::create([
        'board_id' => $board->id,
        'name' => 'Discord',
        'encrypted_webhook_url' => Crypt::encryptString('https://discord.com/api/webhooks/test'),
        'enabled' => true,
        'event_settings' => ['card.created'],
    ]);

    $response = actingAs($user)
        ->from(route('boards.show', $board))
        ->post(route('discord.test', $board));

    $response->assertRedirect(route('boards.show', $board));
    $response->assertSessionHas('success', 'Test message sent.');

    Http::assertSent(function ($request): bool {
        return $request->url() === 'https://discord.com/api/webhooks/test'
            && $request['username'] === 'WHHID bot'
            && str_contains($request['content'], 'WHHID Test');
    });
});
