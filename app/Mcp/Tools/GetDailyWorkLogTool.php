<?php

namespace App\Mcp\Tools;

use App\Models\WorkLogEntry;
use Carbon\Carbon;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Get the daily work log for the authenticated user. Optionally provide a date (YYYY-MM-DD).')]
class GetDailyWorkLogTool extends Tool
{
    public function handle(Request $request): Response
    {
        $user = $request->user();
        $date = $request->input('date') ? Carbon::parse($request->input('date')) : now();

        $entries = WorkLogEntry::where('user_id', $user->id)
            ->whereDate('created_at', $date)
            ->with(['project:id,name', 'board:id,name', 'card:id,title'])
            ->orderBy('created_at')
            ->get();

        return Response::text($entries->toJson(JSON_PRETTY_PRINT));
    }
}
