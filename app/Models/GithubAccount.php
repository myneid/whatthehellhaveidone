<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['user_id', 'github_user_id', 'username', 'avatar_url', 'encrypted_access_token', 'scopes', 'connected_at', 'revoked_at'])]
#[Hidden(['encrypted_access_token'])]
class GithubAccount extends Model
{
    protected function casts(): array
    {
        return [
            'scopes' => 'array',
            'connected_at' => 'datetime',
            'revoked_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function repositories(): HasMany
    {
        return $this->hasMany(GithubRepository::class);
    }

    public function isActive(): bool
    {
        return $this->revoked_at === null;
    }
}
