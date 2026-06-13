<?php

use App\Jobs\RunDeployment;
use Illuminate\Support\Facades\Queue;

beforeEach(function () {
    Queue::fake();
    config(['services.deploy.webhook_secret' => 'test-secret']);
});

function deployPayload(string $ref = 'refs/heads/main'): array
{
    return ['ref' => $ref, 'commits' => []];
}

function deployHeaders(string $payload, string $secret = 'test-secret', string $event = 'push'): array
{
    return [
        'X-GitHub-Event' => $event,
        'X-Hub-Signature-256' => 'sha256='.hash_hmac('sha256', $payload, $secret),
    ];
}

it('dispatches deployment job on push to main', function () {
    $payload = json_encode(deployPayload());
    $response = $this->postJson('/webhooks/deploy', json_decode($payload, true), deployHeaders($payload));

    $response->assertStatus(200);
    Queue::assertPushed(RunDeployment::class);
});

it('ignores pushes to other branches', function () {
    $payload = json_encode(deployPayload('refs/heads/feature/foo'));
    $response = $this->postJson('/webhooks/deploy', json_decode($payload, true), deployHeaders($payload));

    $response->assertStatus(200);
    Queue::assertNothingPushed();
});

it('ignores non-push events', function () {
    $payload = json_encode(['action' => 'opened']);
    $response = $this->postJson('/webhooks/deploy', json_decode($payload, true), deployHeaders($payload, 'test-secret', 'pull_request'));

    $response->assertStatus(200);
    Queue::assertNothingPushed();
});

it('rejects requests with invalid signature', function () {
    $payload = json_encode(deployPayload());
    $response = $this->postJson('/webhooks/deploy', json_decode($payload, true), deployHeaders($payload, 'wrong-secret'));

    $response->assertStatus(401);
    Queue::assertNothingPushed();
});

it('rejects requests with missing signature', function () {
    $response = $this->postJson('/webhooks/deploy', deployPayload(), [
        'X-GitHub-Event' => 'push',
    ]);

    $response->assertStatus(401);
    Queue::assertNothingPushed();
});
