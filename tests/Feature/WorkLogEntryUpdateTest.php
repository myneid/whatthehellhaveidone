<?php

use App\Mcp\Servers\ProjectForgeServer;
use App\Mcp\Tools\UpdateWorkLogEntryTool;
use App\Models\Project;
use App\Models\User;
use App\Models\WorkLogEntry;
use App\Models\WorkLogProjectAlias;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

test('it updates a work log entry body duration and hashtags from the web route', function () {
    $user = User::factory()->create();

    $entry = WorkLogEntry::create([
        'user_id' => $user->id,
        'source' => 'manual',
        'entry_type' => 'manual',
        'body' => 'initial note',
    ]);

    $this->actingAs($user)
        ->put(route('work-log.update', $entry), [
            'body' => 'worked on #alpha tasks',
            'duration_seconds' => 1800,
        ])
        ->assertRedirect();

    $entry->refresh();

    expect($entry->body)->toBe('worked on #alpha tasks')
        ->and($entry->duration_seconds)->toBe(1800)
        ->and($entry->hashtags)->toBe(['alpha']);
});

test('it updates project link from hashtag aliases when editing', function () {
    $user = User::factory()->create();

    $project = Project::create([
        'owner_id' => $user->id,
        'name' => 'Alpha Project',
        'slug' => 'alpha-project',
    ]);

    WorkLogProjectAlias::create([
        'project_id' => $project->id,
        'alias' => 'alpha',
    ]);

    $entry = WorkLogEntry::create([
        'user_id' => $user->id,
        'source' => 'manual',
        'entry_type' => 'manual',
        'body' => 'old body',
    ]);

    $this->actingAs($user)
        ->put(route('work-log.update', $entry), [
            'body' => 'connected to #alpha',
        ])
        ->assertRedirect();

    expect($entry->fresh()->project_id)->toBe($project->id);
});

test('it prevents users from updating another users work log entry', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();

    $entry = WorkLogEntry::create([
        'user_id' => $owner->id,
        'source' => 'manual',
        'entry_type' => 'manual',
        'body' => 'owner body',
    ]);

    $this->actingAs($otherUser)
        ->put(route('work-log.update', $entry), [
            'body' => 'malicious update',
        ])
        ->assertForbidden();
});

test('it updates a work log entry through the api endpoint', function () {
    $user = User::factory()->create();

    $entry = WorkLogEntry::create([
        'user_id' => $user->id,
        'source' => 'api',
        'entry_type' => 'manual',
        'body' => 'from api',
    ]);

    Sanctum::actingAs($user);

    $this->patchJson(route('api.work-log.update', $entry), [
        'body' => 'api edited #beta',
        'duration_seconds' => 600,
    ])->assertOk()
        ->assertJsonPath('entry.id', $entry->id)
        ->assertJsonPath('entry.duration_seconds', 600);

    expect($entry->fresh()->hashtags)->toBe(['beta']);
});

test('project forge server registers the update work log entry mcp tool', function () {
    $tools = (new ReflectionClass(ProjectForgeServer::class))
        ->getProperty('tools')
        ->getDefaultValue();

    expect($tools)->toContain(UpdateWorkLogEntryTool::class);
});
