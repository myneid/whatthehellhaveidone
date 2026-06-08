<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['card_id', 'github_repository_id', 'github_issue_id', 'issue_number', 'issue_url', 'issue_state', 'pull_request_number', 'pull_request_url', 'pull_request_state', 'request_copilot_review', 'last_synced_source', 'last_synced_at'])]
class GithubCardLink extends Model
{
    /** @var list<string> */
    protected $appends = [
        'state',
        'synced_at',
    ];

    protected function casts(): array
    {
        return [
            'request_copilot_review' => 'boolean',
            'last_synced_at' => 'datetime',
        ];
    }

    protected function state(): Attribute
    {
        return Attribute::get(fn (): string => $this->issue_state);
    }

    protected function syncedAt(): Attribute
    {
        return Attribute::get(fn () => $this->last_synced_at);
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
