<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;

class RunDeployment implements ShouldQueue
{
    use Queueable;

    public int $timeout = 300;

    public function handle(): void
    {
        $root = base_path();

        $steps = [
            'git pull' => ['git', 'pull'],
            'migrate' => ['php', 'artisan', 'migrate', '--force'],
            'optimize' => ['php', 'artisan', 'optimize'],
            'npm build' => ['npm', 'run', 'build:ssr'],
        ];

        foreach ($steps as $name => $command) {
            $result = Process::path($root)->run($command);

            Log::info("Deploy [{$name}]", [
                'output' => $result->output(),
                'error' => $result->errorOutput(),
            ]);

            if ($result->failed()) {
                Log::error("Deploy failed at [{$name}]", [
                    'exitCode' => $result->exitCode(),
                    'error' => $result->errorOutput(),
                ]);

                return;
            }
        }

        $this->restartSsrServer($root);

        Log::info('Deploy completed successfully.');
    }

    /**
     * Stop the running Inertia SSR server so its process manager restarts it with the new bundle.
     *
     * A failure here is logged but not fatal: the server may simply not be running yet.
     */
    private function restartSsrServer(string $root): void
    {
        $result = Process::path($root)->run(['php', 'artisan', 'inertia:stop-ssr']);

        Log::info('Deploy [restart ssr]', [
            'output' => $result->output(),
            'error' => $result->errorOutput(),
        ]);
    }
}
