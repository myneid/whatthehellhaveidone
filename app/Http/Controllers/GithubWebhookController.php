<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessGithubWebhook;
use App\Jobs\RunDeployment;
use App\Models\GithubRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class GithubWebhookController extends Controller
{
    public function handle(Request $request): Response
    {
        $deliveryId = $request->header('X-GitHub-Delivery');
        $eventType = $request->header('X-GitHub-Event');
        $signature = $request->header('X-Hub-Signature-256');
        $payload = $request->getContent();

        $repo = GithubRepository::whereNotNull('webhook_secret')->get()
            ->first(function ($repo) use ($payload, $signature) {
                $expected = 'sha256='.hash_hmac('sha256', $payload, $repo->webhook_secret);

                return hash_equals($expected, $signature ?? '');
            });

        if (! $repo) {
            return response('Unauthorized', 401);
        }

        if ($eventType === 'push') {
            if ($request->input('ref') === 'refs/heads/main') {
                RunDeployment::dispatch();
            }

            return response('OK', 200);
        }

        $event = $repo->webhookEvents()->create([
            'event_type' => $eventType,
            'delivery_id' => $deliveryId,
            'payload' => $request->all(),
        ]);

        ProcessGithubWebhook::dispatch($event);

        return response('OK', 200);
    }
}
