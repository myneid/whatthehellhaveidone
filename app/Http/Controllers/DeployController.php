<?php

namespace App\Http\Controllers;

use App\Jobs\RunDeployment;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DeployController extends Controller
{
    public function handle(Request $request): Response
    {
        $secret = config('services.deploy.webhook_secret');
        $signature = $request->header('X-Hub-Signature-256');
        $payload = $request->getContent();

        if (! $secret || ! $signature) {
            return response('Unauthorized', 401);
        }

        $expected = 'sha256='.hash_hmac('sha256', $payload, $secret);

        if (! hash_equals($expected, $signature)) {
            return response('Unauthorized', 401);
        }

        if ($request->header('X-GitHub-Event') !== 'push') {
            return response('OK', 200);
        }

        $ref = $request->input('ref');

        if ($ref !== 'refs/heads/main') {
            return response('OK', 200);
        }

        RunDeployment::dispatch();

        return response('Deployment queued.', 200);
    }
}
