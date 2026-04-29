<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['card_id', 'github_card_link_id', 'source', 'conflict_type', 'board_value', 'github_value', 'resolved_by', 'resolved_at'])]
class SyncConflict extends Model
{
    const UPDATED_AT = null;

    protected function casts(): array
    {
        return [
            'resolved_at' => 'datetime',
        ];
    }

    public function card(): BelongsTo
    {
        return $this->belongsTo(Card::class);
    }

    public function githubCardLink(): BelongsTo
    {
        return $this->belongsTo(GithubCardLink::class);
    }

    public function resolver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }
}
