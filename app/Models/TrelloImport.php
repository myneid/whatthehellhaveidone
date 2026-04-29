<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'board_id', 'source_board_id', 'source_board_name', 'status', 'filename', 'summary', 'errors', 'warnings', 'error_message', 'started_at', 'completed_at'])]
class TrelloImport extends Model
{
    protected function casts(): array
    {
        return [
            'summary' => 'array',
            'errors' => 'array',
            'warnings' => 'array',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }
}
