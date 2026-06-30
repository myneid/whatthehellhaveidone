<?php

use App\Mcp\Servers\ProjectForgeServer;
use App\Mcp\Tools\GetDailyWorkLogTool;
use App\Models\User;
use App\Models\WorkLogEntry;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('it returns todays work log entries when no date is given', function () {
    $user = User::factory()->create();

    WorkLogEntry::create([
        'user_id' => $user->id,
        'source' => 'manual',
        'entry_type' => 'manual',
        'body' => 'worked today',
    ]);

    WorkLogEntry::create([
        'user_id' => $user->id,
        'source' => 'manual',
        'entry_type' => 'manual',
        'body' => 'worked yesterday',
    ])->forceFill(['created_at' => now()->subDay()])->save();

    $response = ProjectForgeServer::actingAs($user)->tool(GetDailyWorkLogTool::class, []);

    $response->assertOk()
        ->assertSee('worked today')
        ->assertDontSee('worked yesterday');
});

test('it returns work log entries for an explicit date', function () {
    $user = User::factory()->create();

    WorkLogEntry::create([
        'user_id' => $user->id,
        'source' => 'manual',
        'entry_type' => 'manual',
        'body' => 'worked on the chosen day',
    ])->forceFill(['created_at' => '2026-01-05 10:00:00'])->save();

    WorkLogEntry::create([
        'user_id' => $user->id,
        'source' => 'manual',
        'entry_type' => 'manual',
        'body' => 'worked on a different day',
    ])->forceFill(['created_at' => '2026-01-06 10:00:00'])->save();

    $response = ProjectForgeServer::actingAs($user)->tool(GetDailyWorkLogTool::class, [
        'date' => '2026-01-05',
    ]);

    $response->assertOk()
        ->assertSee('worked on the chosen day')
        ->assertDontSee('worked on a different day');
});
