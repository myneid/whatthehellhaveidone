<?php

namespace App\Models;

use Database\Factories\WorkLogEntryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'project_id', 'board_id', 'card_id', 'source', 'entry_type', 'body', 'hashtags', 'started_at', 'ended_at', 'duration_seconds', 'reference_url', 'metadata'])]
class WorkLogEntry extends Model
{
    /** @use HasFactory<WorkLogEntryFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'hashtags' => 'array',
            'metadata' => 'array',
            'started_at' => 'datetime',
            'ended_at' => 'datetime',
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

    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }

    public function card(): BelongsTo
    {
        return $this->belongsTo(Card::class);
    }
}
