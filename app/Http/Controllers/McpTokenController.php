<?php

namespace App\Http\Controllers;

use App\Models\McpToken;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class McpTokenController extends Controller
{
    public function index(Request $request): Response
    {
        $tokens = $request->user()->mcpTokens()
            ->orderBy('created_at', 'desc')
            ->get(['id', 'name', 'scopes', 'allowed_tools', 'last_used_at', 'revoked_at', 'created_at']);

        return Inertia::render('settings/mcp-tokens', [
            'tokens' => $tokens,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'scopes' => ['nullable', 'array'],
            'project_id' => ['nullable', 'exists:projects,id'],
        ]);

        $plainToken = Str::random(64);

        $request->user()->mcpTokens()->create([
            'name' => $request->name,
            'project_id' => $request->project_id,
            'token_hash' => hash('sha256', $plainToken),
            'scopes' => $request->scopes ?? ['mcp:read', 'mcp:write'],
        ]);

        return back()->with('token', $plainToken);
    }

    public function destroy(McpToken $mcpToken): RedirectResponse
    {
        abort_if($mcpToken->user_id !== auth()->id(), 403);
        $mcpToken->update(['revoked_at' => now()]);

        return back();
    }
}
