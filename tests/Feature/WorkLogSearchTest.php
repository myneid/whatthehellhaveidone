<?php

use App\Models\Board;
use App\Models\Project;
use App\Models\User;
use App\Models\WorkLogEntry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('search matches entry body', function () {
    $user = User::factory()->create();

    $match = WorkLogEntry::create([
        'user_id' => $user->id,
        'source' => 'manual',
        'entry_type' => 'manual',
        'body' => 'wrote the boogs proposal',
    ]);

    $other = WorkLogEntry::create([
        'user_id' => $user->id,
        'source' => 'manual',
        'entry_type' => 'manual',
        'body' => 'unrelated note',
    ]);

    $this->actingAs($user)
        ->get(route('work-log.index', ['search' => 'boogs']))
        ->assertInertia(fn (Assert $page) => $page->where('entries.data.0.id', $match->id)
            ->where('entries.total', 1)
        );
});

test('search matches entry hashtags', function () {
    $user = User::factory()->create();

    $match = WorkLogEntry::create([
        'user_id' => $user->id,
        'source' => 'manual',
        'entry_type' => 'manual',
        'body' => 'tagged work',
        'hashtags' => ['boogs'],
    ]);

    WorkLogEntry::create([
        'user_id' => $user->id,
        'source' => 'manual',
        'entry_type' => 'manual',
        'body' => 'other tagged work',
        'hashtags' => ['alpha'],
    ]);

    $this->actingAs($user)
        ->get(route('work-log.index', ['search' => 'boogs']))
        ->assertInertia(fn (Assert $page) => $page->where('entries.data.0.id', $match->id)
            ->where('entries.total', 1)
        );
});

test('search matches the entrys project name', function () {
    $user = User::factory()->create();

    $project = Project::create([
        'owner_id' => $user->id,
        'name' => 'Boogs',
        'slug' => 'boogs',
    ]);

    $match = WorkLogEntry::create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'source' => 'manual',
        'entry_type' => 'manual',
        'body' => 'progress update',
    ]);

    WorkLogEntry::create([
        'user_id' => $user->id,
        'source' => 'manual',
        'entry_type' => 'manual',
        'body' => 'unrelated note',
    ]);

    $this->actingAs($user)
        ->get(route('work-log.index', ['search' => 'boogs']))
        ->assertInertia(fn (Assert $page) => $page->where('entries.data.0.id', $match->id)
            ->where('entries.total', 1)
        );
});

test('search matches the entrys board name', function () {
    $user = User::factory()->create();

    $board = Board::create([
        'owner_id' => $user->id,
        'name' => 'Boogs Board',
        'slug' => 'boogs-board',
    ]);

    $match = WorkLogEntry::create([
        'user_id' => $user->id,
        'board_id' => $board->id,
        'source' => 'manual',
        'entry_type' => 'manual',
        'body' => 'progress update',
    ]);

    WorkLogEntry::create([
        'user_id' => $user->id,
        'source' => 'manual',
        'entry_type' => 'manual',
        'body' => 'unrelated note',
    ]);

    $this->actingAs($user)
        ->get(route('work-log.index', ['search' => 'boogs']))
        ->assertInertia(fn (Assert $page) => $page->where('entries.data.0.id', $match->id)
            ->where('entries.total', 1)
        );
});
