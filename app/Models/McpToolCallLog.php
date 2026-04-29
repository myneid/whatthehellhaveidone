<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'mcp_token_id', 'project_id', 'tool_name', 'input_summary', 'output_summary', 'status', 'error_message', 'ip_address', 'user_agent'])]
class McpToolCallLog extends Model
{
    const UPDATED_AT = null;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function mcpToken(): BelongsTo
    {
        return $this->belongsTo(McpToken::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
