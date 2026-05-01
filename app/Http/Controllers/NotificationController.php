<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->limit(50)
            ->get()
            ->map(function (DatabaseNotification $notification): array {
                /** @var array<string, mixed> $data */
                $data = $notification->data;

                return [
                    'id' => $notification->id,
                    'read_at' => $notification->read_at?->toISOString(),
                    'created_at' => $notification->created_at?->toISOString(),
                    'href' => isset($data['card_id']) ? route('cards.show', $data['card_id']) : null,
                    ...$data,
                ];
            });

        return Inertia::render('notifications/index', [
            'notifications' => $notifications,
        ]);
    }

    public function markAsRead(Request $request, DatabaseNotification $notification): RedirectResponse
    {
        abort_unless(
            $request->user()->notifications()->whereKey($notification->id)->exists(),
            403,
        );

        $notification->markAsRead();

        return back();
    }

    public function markAllAsRead(Request $request): RedirectResponse
    {
        $request->user()->unreadNotifications()->update(['read_at' => now()]);

        return back();
    }

    public function destroy(Request $request, DatabaseNotification $notification): RedirectResponse
    {
        abort_unless(
            $request->user()->notifications()->whereKey($notification->id)->exists(),
            403,
        );

        $notification->delete();

        return back();
    }
}
