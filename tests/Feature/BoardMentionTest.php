<?php

use App\Models\Board;
use App\Models\BoardList;
use App\Models\BoardMember;
use App\Models\Card;
use App\Models\Invitation;
use App\Models\Project;
use App\Models\User;
use App\Notifications\CardMentionedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

it('includes project members in mentionable users for team boards', function (): void {
    $owner = User::factory()->create();
    $projectMember = User::factory()->create(['name' => 'Project Teammate']);

    $project = Project::create([
        'owner_id' => $owner->id,
        'name' => 'Apollo',
        'slug' => 'apollo-mentions',
    ]);

    $project->members()->create(['user_id' => $owner->id, 'role' => 'owner']);
    $project->members()->create(['user_id' => $projectMember->id, 'role' => 'member']);

    $board = Board::create([
        'project_id' => $project->id,
        'owner_id' => $owner->id,
        'name' => 'Sprint Board',
        'slug' => 'sprint-board-mentions',
        'visibility' => 'team',
    ]);

    BoardMember::create([
        'board_id' => $board->id,
        'user_id' => $owner->id,
        'role' => 'admin',
    ]);

    actingAs($owner)
        ->get(route('boards.show', $board))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('boards/show')
            ->where('mentionableMembers', fn ($members) => collect($members)->contains(
                fn ($member) => $member['id'] === $projectMember->id && $member['name'] === 'Project Teammate',
            )),
        );
});

it('notifies project members mentioned in comments even when they are not board members', function (): void {
    Notification::fake();

    $owner = User::factory()->create();
    $projectMember = User::factory()->create(['name' => 'Project Teammate']);

    $project = Project::create([
        'owner_id' => $owner->id,
        'name' => 'Apollo',
        'slug' => 'apollo-comment-mentions',
    ]);

    $project->members()->create(['user_id' => $owner->id, 'role' => 'owner']);
    $project->members()->create(['user_id' => $projectMember->id, 'role' => 'member']);

    $board = Board::create([
        'project_id' => $project->id,
        'owner_id' => $owner->id,
        'name' => 'Sprint Board',
        'slug' => 'sprint-board-comment-mentions',
        'visibility' => 'team',
    ]);

    BoardMember::create([
        'board_id' => $board->id,
        'user_id' => $owner->id,
        'role' => 'admin',
    ]);

    $list = BoardList::create([
        'board_id' => $board->id,
        'name' => 'To Do',
        'position' => 1,
    ]);

    $card = Card::create([
        'board_id' => $board->id,
        'list_id' => $list->id,
        'creator_id' => $owner->id,
        'title' => 'Review API',
        'position' => 1,
    ]);

    actingAs($owner)
        ->post(route('cards.comments.store', $card), [
            'body' => 'Please review this @Project Teammate',
        ])
        ->assertRedirect();

    Notification::assertSentTo($projectMember, CardMentionedNotification::class);
});

it('clears pending invitations when an existing user is added to a project', function (): void {
    $owner = User::factory()->create();
    $invitee = User::factory()->create(['email' => 'invitee@example.com']);

    $project = Project::create([
        'owner_id' => $owner->id,
        'name' => 'Cleanup Project',
        'slug' => 'cleanup-project',
    ]);

    $project->members()->create(['user_id' => $owner->id, 'role' => 'owner']);

    $invitation = Invitation::create([
        'project_id' => $project->id,
        'invited_by' => $owner->id,
        'email' => 'invitee@example.com',
        'role' => 'member',
        'token' => 'pending-token',
        'expires_at' => now()->addDays(3),
    ]);

    actingAs($owner)
        ->post(route('projects.members.store', $project), [
            'email' => 'invitee@example.com',
            'role' => 'member',
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    expect($invitation->fresh()->accepted_at)->not->toBeNull();
});

it('reconciles stale pending invitations when viewing a project', function (): void {
    $owner = User::factory()->create();
    $member = User::factory()->create(['email' => 'member@example.com']);

    $project = Project::create([
        'owner_id' => $owner->id,
        'name' => 'Filter Project',
        'slug' => 'filter-project',
    ]);

    $project->members()->create(['user_id' => $owner->id, 'role' => 'owner']);
    $project->members()->create(['user_id' => $member->id, 'role' => 'member']);

    $invitation = Invitation::create([
        'project_id' => $project->id,
        'invited_by' => $owner->id,
        'email' => 'member@example.com',
        'role' => 'member',
        'token' => 'stale-token',
        'expires_at' => now()->addDays(3),
    ]);

    actingAs($owner)
        ->get(route('projects.show', $project))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('projects/show')
            ->where('project.invitations', []),
        );

    expect($invitation->fresh()->accepted_at)->not->toBeNull();
});
