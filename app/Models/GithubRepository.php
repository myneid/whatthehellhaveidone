<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['github_account_id', 'github_repo_id', 'owner', 'name', 'full_name', 'private', 'html_url', 'webhook_id', 'webhook_secret'])]
#[Hidden(['webhook_secret'])]
class GithubRepository extends Model
{
    protected function casts(): array
    {
        return [
            'private' => 'boolean',
        ];
    }

    public function githubAccount(): BelongsTo
    {
        return $this->belongsTo(GithubAccount::class);
    }

    public function boards(): BelongsToMany
    {
        return $this->belongsToMany(Board::class, 'board_github_repositories')
            ->withPivot(['sync_direction', 'status_mapping'])
            ->withTimestamps();
    }

    public function cardLinks(): HasMany
    {
        return $this->hasMany(GithubCardLink::class);
    }

    public function webhookEvents(): HasMany
    {
        return $this->hasMany(GithubWebhookEvent::class);
    }
}
