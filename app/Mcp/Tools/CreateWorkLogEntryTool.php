<?php

namespace App\Mcp\Tools;

use App\Services\WorkLogService;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Create a work log entry. Supports hashtags for project association (e.g. #projectname).')]
class CreateWorkLogEntryTool extends Tool
{
    public function __construct(private readonly WorkLogService $workLogService) {}

    public function handle(Request $request): Response
    {
        $request->validate(['body' => ['required', 'string']]);

        $entry = $this->workLogService->logFromHashtags(
            $request->input('body'),
            $request->user(),
            array_filter([
                'project_id' => $request->input('project_id'),
                'card_id' => $request->input('card_id'),
                'source' => $request->input('source', 'api'),
                'reference_url' => $request->input('reference_url'),
            ])
        );

        return Response::text("Work log entry created: #{$entry->id}");
    }
}
