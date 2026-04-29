<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['card_id', 'github_repository_id', 'github_issue_id', 'issue_number', 'issue_url', 'issue_state', 'last_synced_source', 'last_synced_at'])]
class GithubCardLink extends Model
{
    protected function casts(): array
    {
        return [
            'last_synced_at' => 'datetime',
        ];
    }

    public function card(): BelongsTo
    {
        return $this->belongsTo(Card::class);
    }

    public function githubRepository(): BelongsTo
    {
        return $this->belongsTo(GithubRepository::class);
    }
}
