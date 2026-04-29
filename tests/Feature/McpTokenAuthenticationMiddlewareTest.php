<?php

use App\Models\McpToken;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

uses(RefreshDatabase::class);

beforeEach(function () {
    Route::middleware('mcp.token')->get('/__test/mcp-auth', function (Request $request) {
        return response()->json([
            'user_id' => $request->user()?->id,
        ]);
    });
});

test('it authenticates requests with a valid mcp bearer token', function () {
    $user = User::factory()->create();
    $plainToken = str_repeat('a', 64);

    McpToken::create([
        'user_id' => $user->id,
        'name' => 'Claude Desktop',
        'token_hash' => hash('sha256', $plainToken),
        'scopes' => ['mcp:read', 'mcp:write'],
    ]);

    $this->withHeader('Authorization', 'Bearer '.$plainToken)
        ->get('/__test/mcp-auth')
        ->assertOk()
        ->assertJson([
            'user_id' => $user->id,
        ]);

    $this->assertNotNull(McpToken::first()?->last_used_at);
});

test('it rejects requests without a valid active mcp bearer token', function () {
    $user = User::factory()->create();

    McpToken::create([
        'user_id' => $user->id,
        'name' => 'Revoked',
        'token_hash' => hash('sha256', str_repeat('b', 64)),
        'scopes' => ['mcp:read'],
        'revoked_at' => now(),
    ]);

    $this->get('/__test/mcp-auth')->assertUnauthorized();

    $this->withHeader('Authorization', 'Bearer '.str_repeat('c', 64))
        ->get('/__test/mcp-auth')
        ->assertUnauthorized();
});
