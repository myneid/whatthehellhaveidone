<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['github_repository_id', 'event_type', 'delivery_id', 'payload', 'processed_at', 'failed_at', 'failure_reason'])]
class GithubWebhookEvent extends Model
{
    const UPDATED_AT = null;

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'processed_at' => 'datetime',
            'failed_at' => 'datetime',
        ];
    }

    public function githubRepository(): BelongsTo
    {
        return $this->belongsTo(GithubRepository::class);
    }
}
