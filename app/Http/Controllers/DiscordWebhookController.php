<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\DiscordWebhook;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;

class DiscordWebhookController extends Controller
{
    public function store(Request $request, Board $board): RedirectResponse
    {
        $this->authorize('update', $board);

        $request->validate([
            'webhook_url' => ['required', 'url'],
            'event_settings' => ['nullable', 'array'],
        ]);

        $board->discordWebhook()->create([
            'encrypted_webhook_url' => Crypt::encryptString($request->webhook_url),
            'enabled' => true,
            'event_settings' => $request->event_settings,
        ]);

        return back()->with('success', 'Discord webhook configured.');
    }

    public function update(Request $request, Board $board): RedirectResponse
    {
        $this->authorize('update', $board);

        $request->validate([
            'webhook_url' => ['sometimes', 'url'],
            'enabled' => ['sometimes', 'boolean'],
            'event_settings' => ['nullable', 'array'],
        ]);

        $data = array_filter([
            'enabled' => $request->enabled,
            'event_settings' => $request->event_settings,
        ], fn ($v) => $v !== null);

        if ($request->webhook_url) {
            $data['encrypted_webhook_url'] = Crypt::encryptString($request->webhook_url);
        }

        $board->discordWebhook()->update($data);

        return back()->with('success', 'Discord webhook updated.');
    }

    public function destroy(Board $board): RedirectResponse
    {
        $this->authorize('update', $board);
        $board->discordWebhook()->delete();

        return back()->with('success', 'Discord webhook removed.');
    }

    public function test(Request $request, Board $board): RedirectResponse
    {
        $this->authorize('update', $board);

        $webhook = $board->discordWebhook;
        if (! $webhook) {
            return back()->withErrors(['No webhook configured.']);
        }

        try {
            $url = Crypt::decryptString($webhook->encrypted_webhook_url);
            Http::post($url, [
                'content' => "✅ **ProjectForge Test**\nWebhook configured successfully for board: **{$board->name}**",
            ]);

            return back()->with('success', 'Test message sent.');
        } catch (\Exception $e) {
            return back()->withErrors(['Failed to send test message: ' . $e->getMessage()]);
        }
    }
}
