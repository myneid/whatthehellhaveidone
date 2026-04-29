<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['user_id', 'project_id', 'name', 'token_hash', 'scopes', 'allowed_tools', 'last_used_at', 'revoked_at'])]
#[Hidden(['token_hash'])]
class McpToken extends Model
{
    protected function casts(): array
    {
        return [
            'scopes' => 'array',
            'allowed_tools' => 'array',
            'last_used_at' => 'datetime',
            'revoked_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function toolCallLogs(): HasMany
    {
        return $this->hasMany(McpToolCallLog::class);
    }

    public function isActive(): bool
    {
        return $this->revoked_at === null;
    }

    public function hasScope(string $scope): bool
    {
        return in_array($scope, $this->scopes ?? [], true);
    }
}
