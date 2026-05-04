<?php

namespace App\Mcp\Tools;

use App\Models\WorkLogEntry;
use App\Services\WorkLogService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Update an existing work log entry body and optional time-spent metadata. Re-parses hashtags from the updated body.')]
class UpdateWorkLogEntryTool extends Tool
{
    public function __construct(private readonly WorkLogService $workLogService) {}

    public function handle(Request $request): Response
    {
        $validated = $request->validate([
            'entry_id' => ['required', 'integer', 'exists:work_log_entries,id'],
            'body' => ['required', 'string', 'max:5000'],
            'project_id' => ['nullable', 'integer', 'exists:projects,id'],
            'board_id' => ['nullable', 'integer', 'exists:boards,id'],
            'card_id' => ['nullable', 'integer', 'exists:cards,id'],
            'started_at' => ['nullable', 'date'],
            'ended_at' => ['nullable', 'date'],
            'duration_seconds' => ['nullable', 'integer', 'min:0'],
            'duration_minutes' => ['nullable', 'numeric', 'min:0'],
            'reference_url' => ['nullable', 'url'],
            'metadata' => ['nullable', 'array'],
        ]);

        /** @var WorkLogEntry $entry */
        $entry = WorkLogEntry::query()->findOrFail($validated['entry_id']);

        if ($entry->user_id !== $request->user()->id) {
            return Response::error('You do not have permission to edit this work log entry.');
        }

        if (! isset($validated['duration_seconds']) && isset($validated['duration_minutes'])) {
            $validated['duration_seconds'] = (int) round($validated['duration_minutes'] * 60);
        }

        $updated = $this->workLogService->updateEntryFromHashtags(
            $entry,
            $validated['body'],
            array_filter([
                'project_id' => $validated['project_id'] ?? null,
                'board_id' => $validated['board_id'] ?? null,
                'card_id' => $validated['card_id'] ?? null,
                'started_at' => $validated['started_at'] ?? null,
                'ended_at' => $validated['ended_at'] ?? null,
                'duration_seconds' => $validated['duration_seconds'] ?? null,
                'reference_url' => $validated['reference_url'] ?? null,
                'metadata' => $validated['metadata'] ?? null,
            ], fn ($value) => $value !== null),
        );

        return Response::text("Work log entry updated: #{$updated->id}");
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'entry_id' => $schema->integer()->required(),
            'body' => $schema->string()->required(),
            'project_id' => $schema->integer(),
            'board_id' => $schema->integer(),
            'card_id' => $schema->integer(),
            'started_at' => $schema->string(),
            'ended_at' => $schema->string(),
            'duration_seconds' => $schema->integer(),
            'duration_minutes' => $schema->number(),
            'reference_url' => $schema->string(),
            'metadata' => $schema->object(),
        ];
    }
}
