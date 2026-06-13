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
            'npm build' => ['npm', 'run', 'build'],
            'queue restart' => ['php', 'artisan', 'queue:restart'],
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

        Log::info('Deploy completed successfully.');
    }
}
