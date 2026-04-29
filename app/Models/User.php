<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'avatar', 'timezone'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_super_admin' => 'boolean',
        ];
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->is_super_admin;
    }

    public function ownedProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'owner_id');
    }

    public function projectMembers(): HasMany
    {
        return $this->hasMany(ProjectMember::class);
    }

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_members')->withPivot('role')->withTimestamps();
    }

    public function ownedBoards(): HasMany
    {
        return $this->hasMany(Board::class, 'owner_id');
    }

    public function boardMembers(): HasMany
    {
        return $this->hasMany(BoardMember::class);
    }

    public function boards(): BelongsToMany
    {
        return $this->belongsToMany(Board::class, 'board_members')->withPivot('role')->withTimestamps();
    }

    public function cardAssignments(): HasMany
    {
        return $this->hasMany(CardAssignment::class);
    }

    public function assignedCards(): BelongsToMany
    {
        return $this->belongsToMany(Card::class, 'card_assignments');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(CardComment::class);
    }

    public function workLogEntries(): HasMany
    {
        return $this->hasMany(WorkLogEntry::class);
    }

    public function githubAccounts(): HasMany
    {
        return $this->hasMany(GithubAccount::class);
    }

    public function mcpTokens(): HasMany
    {
        return $this->hasMany(McpToken::class);
    }
}
