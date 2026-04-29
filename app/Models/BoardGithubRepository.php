<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['board_id', 'github_repository_id', 'sync_direction', 'status_mapping'])]
class BoardGithubRepository extends Model
{
    protected function casts(): array
    {
        return [
            'status_mapping' => 'array',
        ];
    }

    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }

    public function githubRepository(): BelongsTo
    {
        return $this->belongsTo(GithubRepository::class);
    }
}
