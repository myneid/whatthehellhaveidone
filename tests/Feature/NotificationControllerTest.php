<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function createDatabaseNotification(User $user, array $data = [], ?string $readAt = null): DatabaseNotification
{
    return $user->notifications()->create([
        'id' => (string) Str::uuid(),
        'type' => 'test-notification',
        'data' => [
            'card_id' => 123,
            'card_title' => 'Ship notifications',
            'action' => 'updated',
            'actor_name' => 'Taylor',
            'detail' => 'left a comment',
            'board_slug' => 'product',
            ...$data,
        ],
        'read_at' => $readAt,
    ]);
}

test('guests are redirected from notifications', function () {
    $this->get(route('notifications.index'))->assertRedirect(route('login'));
});

test('users can view their notifications without marking them read', function () {
    $user = User::factory()->create();
    $notification = createDatabaseNotification($user);

    $this->actingAs($user)
        ->get(route('notifications.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('notifications/index')
            ->where('notifications.0.id', $notification->id)
            ->where('notifications.0.card_title', 'Ship notifications')
            ->where('notifications.0.read_at', null),
        );

    expect($notification->fresh()->read_at)->toBeNull();
});

test('unread notification count is shared with inertia pages', function () {
    $user = User::factory()->create();
    createDatabaseNotification($user);
    createDatabaseNotification($user);
    createDatabaseNotification($user, readAt: now()->toDateTimeString());

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('auth.unreadNotificationsCount', 2),
        );
});

test('users can mark a notification as read', function () {
    $user = User::factory()->create();
    $notification = createDatabaseNotification($user);

    $this->actingAs($user)
        ->patch(route('notifications.mark-read', $notification))
        ->assertRedirect();

    expect($notification->fresh()->read_at)->not->toBeNull();
});

test('users can mark all notifications as read', function () {
    $user = User::factory()->create();
    $first = createDatabaseNotification($user);
    $second = createDatabaseNotification($user);

    $this->actingAs($user)
        ->patch(route('notifications.read'))
        ->assertRedirect();

    expect($first->fresh()->read_at)->not->toBeNull()
        ->and($second->fresh()->read_at)->not->toBeNull();
});

test('users can delete their notifications', function () {
    $user = User::factory()->create();
    $notification = createDatabaseNotification($user);

    $this->actingAs($user)
        ->delete(route('notifications.destroy', $notification))
        ->assertRedirect();

    expect($notification->fresh())->toBeNull();
});

test('users cannot update or delete another users notifications', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $notification = createDatabaseNotification($otherUser);

    $this->actingAs($user)
        ->patch(route('notifications.mark-read', $notification))
        ->assertForbidden();

    $this->actingAs($user)
        ->delete(route('notifications.destroy', $notification))
        ->assertForbidden();

    expect($notification->fresh())->not->toBeNull()
        ->and($notification->fresh()->read_at)->toBeNull();
});
