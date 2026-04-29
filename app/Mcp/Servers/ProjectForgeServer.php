<?php

namespace App\Mcp\Servers;

use App\Mcp\Tools\CreateCardTool;
use App\Mcp\Tools\CreateWorkLogEntryTool;
use App\Mcp\Tools\GetBoardTool;
use App\Mcp\Tools\GetCardTool;
use App\Mcp\Tools\GetDailyWorkLogTool;
use App\Mcp\Tools\GetDocumentTool;
use App\Mcp\Tools\ListCardsTool;
use App\Mcp\Tools\ListDocumentsTool;
use App\Mcp\Tools\ListProjectsTool;
use App\Mcp\Tools\MoveCardTool;
use Laravel\Mcp\Server;
use Laravel\Mcp\Server\Attributes\Instructions;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Version;

#[Name('whatthehellhaveidone')]
#[Version('1.0.0')]
#[Instructions('whatthehellhaveidone MCP server. Manage projects, boards, cards, work logs, and documents. All operations respect the authenticated user\'s permissions.')]
class ProjectForgeServer extends Server
{
    protected array $tools = [
        ListProjectsTool::class,
        GetBoardTool::class,
        ListCardsTool::class,
        GetCardTool::class,
        CreateCardTool::class,
        MoveCardTool::class,
        CreateWorkLogEntryTool::class,
        GetDailyWorkLogTool::class,
        ListDocumentsTool::class,
        GetDocumentTool::class,
    ];

    protected array $resources = [];

    protected array $prompts = [];
}
