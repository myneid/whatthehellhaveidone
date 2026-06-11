<?php

use App\BoardMemberRole;
use App\Jobs\SendDiscordNotification;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\BoardMember;
use App\Models\Card;
use App\Models\DiscordWebhook;
use App\Models\User;
use App\Notifications\CardActivityNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

function createBoardNotificationFixture(string $slug): array
{
    $owner = User::factory()->create();
    $actor = User::factory()->create();
    $member = User::factory()->create();

    $board = Board::create([
        'owner_id' => $owner->id,
        'name' => 'Roadmap',
        'slug' => $slug,
        'visibility' => 'team',
    ]);

    BoardMember::create([
        'board_id' => $board->id,
        'user_id' => $actor->id,
        'role' => BoardMemberRole::Member->value,
    ]);

    BoardMember::create([
        'board_id' => $board->id,
        'user_id' => $member->id,
        'role' => BoardMemberRole::Member->value,
    ]);

    $list = BoardList::create([
        'board_id' => $board->id,
        'name' => 'To Do',
        'position' => 1,
    ]);

    $card = Card::create([
        'board_id' => $board->id,
        'list_id' => $list->id,
        'creator_id' => $actor->id,
        'title' => 'Ship it',
        'position' => 1,
        'priority' => 'medium',
    ]);

    DiscordWebhook::create([
        'board_id' => $board->id,
        'name' => 'Discord',
        'encrypted_webhook_url' => encrypt('https://discord.com/api/webhooks/test-board-notifications'),
        'enabled' => true,
        'event_settings' => null,
    ]);

    return [$owner, $actor, $member, $board, $card];
}

it('notifies all board users when a card is commented on', function (): void {
    Notification::fake();
    Bus::fake();

    [$owner, $actor, $member, $board, $card] = createBoardNotificationFixture('roadmap-comment-notifications');

    actingAs($actor)
        ->post(route('cards.comments.store', $card), ['body' => 'Looks good to me'])
        ->assertRedirect();

    Notification::assertSentTo($owner, CardActivityNotification::class, function (CardActivityNotification $notification) use ($card): bool {
        return $notification->action === 'commented'
            && $notification->detail === $notification->actor->name.' commented on #'.$card->number.' "'.$card->title.'"';
    });

    Notification::assertSentTo($member, CardActivityNotification::class, function (CardActivityNotification $notification) use ($card): bool {
        return $notification->action === 'commented'
            && $notification->detail === $notification->actor->name.' commented on #'.$card->number.' "'.$card->title.'"';
    });

    Notification::assertNotSentTo($actor, CardActivityNotification::class);

    Bus::assertDispatched(SendDiscordNotification::class, function (SendDiscordNotification $job) use ($card): bool {
        return $job->card->is($card) && $job->eventType === 'card.commented';
    });
});

it('notifies all board users when a card attachment is added', function (): void {
    Notification::fake();
    Bus::fake();
    Storage::fake('public');

    [$owner, $actor, $member, $board, $card] = createBoardNotificationFixture('roadmap-attachment-notifications');

    actingAs($actor)
        ->post(route('cards.attachments.store', $card), [
            'file' => UploadedFile::fake()->image('design.png'),
        ])
        ->assertRedirect();

    Notification::assertSentTo($owner, CardActivityNotification::class, function (CardActivityNotification $notification) use ($card): bool {
        return $notification->action === 'attachment_added'
            && $notification->detail === $notification->actor->name.' added an image to #'.$card->number.' "'.$card->title.'"';
    });

    Notification::assertSentTo($member, CardActivityNotification::class, function (CardActivityNotification $notification) use ($card): bool {
        return $notification->action === 'attachment_added'
            && $notification->detail === $notification->actor->name.' added an image to #'.$card->number.' "'.$card->title.'"';
    });

    Notification::assertNotSentTo($actor, CardActivityNotification::class);

    Bus::assertDispatched(SendDiscordNotification::class, function (SendDiscordNotification $job) use ($card): bool {
        return $job->card->is($card) && $job->eventType === 'card.attachment_added';
    });
});
