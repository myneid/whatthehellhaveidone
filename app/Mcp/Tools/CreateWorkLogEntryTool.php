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
            $request->get('body'),
            $request->user(),
            array_filter([
                'project_id' => $request->get('project_id'),
                'card_id' => $request->get('card_id'),
                'source' => $request->get('source', 'api'),
                'reference_url' => $request->get('reference_url'),
            ])
        );

        return Response::text("Work log entry created: #{$entry->id}");
    }
}
