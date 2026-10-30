<?php

use App\Jobs\RunDeployment;
use Illuminate\Process\PendingProcess;
use Illuminate\Support\Facades\Process;

it('builds the ssr bundle and restarts the ssr server', function () {
    Process::fake();

    (new RunDeployment)->handle();

    Process::assertRan(fn (PendingProcess $process): bool => $process->command === ['npm', 'run', 'build:ssr']);
    Process::assertRan(fn (PendingProcess $process): bool => $process->command === ['php', 'artisan', 'inertia:stop-ssr']);
});

it('stops before restarting ssr when a build step fails', function () {
    Process::fake([
        '*build:ssr*' => Process::result(exitCode: 1, errorOutput: 'build failed'),
        '*' => Process::result(),
    ]);

    (new RunDeployment)->handle();

    Process::assertDidntRun(fn (PendingProcess $process): bool => $process->command === ['php', 'artisan', 'inertia:stop-ssr']);
});

it('completes the deploy even if the ssr server is not running', function () {
    Process::fake([
        '*inertia:stop-ssr*' => Process::result(exitCode: 1, errorOutput: 'Unable to connect to SSR server.'),
        '*' => Process::result(),
    ]);

    (new RunDeployment)->handle();

    Process::assertRan(fn (PendingProcess $process): bool => $process->command === ['php', 'artisan', 'inertia:stop-ssr']);
});
