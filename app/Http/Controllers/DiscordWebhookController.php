<?php

namespace App\Http\Controllers;

use App\Models\Board;
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
            'name' => ['nullable', 'string', 'max:100'],
            'events' => ['nullable', 'array'],
        ]);

        $board->discordWebhook()->create([
            'name' => $request->name ?? 'Discord',
            'encrypted_webhook_url' => Crypt::encryptString($request->webhook_url),
            'enabled' => true,
            'event_settings' => $request->events ?? ['card.created', 'card.moved'],
        ]);

        return back()->with('success', 'Discord webhook configured.');
    }

    public function update(Request $request, Board $board): RedirectResponse
    {
        $this->authorize('update', $board);

        $request->validate([
            'webhook_url' => ['nullable', 'url'],
            'name' => ['nullable', 'string', 'max:100'],
            'is_active' => ['sometimes', 'boolean'],
            'events' => ['nullable', 'array'],
        ]);

        $data = [];

        if ($request->has('name')) {
            $data['name'] = $request->name ?? 'Discord';
        }
        if ($request->has('is_active')) {
            $data['enabled'] = $request->is_active;
        }
        if ($request->has('events')) {
            $data['event_settings'] = $request->events;
        }
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
                'content' => "✅ **WHHID Test**\nWebhook configured successfully for board: **{$board->name}**",
            ]);

            return back()->with('success', 'Test message sent.');
        } catch (\Exception $e) {
            return back()->withErrors(['Failed to send test message: '.$e->getMessage()]);
        }
    }
}
