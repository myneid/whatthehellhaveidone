<?php

namespace App\Models;

use Database\Factories\BoardFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Collection;

#[Fillable(['project_id', 'owner_id', 'name', 'slug', 'description', 'visibility', 'background_color', 'copilot_done_list_id', 'done_list_id', 'todo_list_id', 'work_start_list_id', 'archived_at'])]
class Board extends Model
{
    /** @use HasFactory<BoardFactory> */
    use HasFactory;

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected function casts(): array
    {
        return [
            'archived_at' => 'datetime',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members(): HasMany
    {
        return $this->hasMany(BoardMember::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'board_members')->withPivot('role')->withTimestamps();
    }

    public function lists(): HasMany
    {
        return $this->hasMany(BoardList::class)->orderBy('position');
    }

    public function copilotDoneList(): BelongsTo
    {
        return $this->belongsTo(BoardList::class, 'copilot_done_list_id');
    }

    public function doneList(): BelongsTo
    {
        return $this->belongsTo(BoardList::class, 'done_list_id');
    }

    public function todoList(): BelongsTo
    {
        return $this->belongsTo(BoardList::class, 'todo_list_id');
    }

    public function workStartList(): BelongsTo
    {
        return $this->belongsTo(BoardList::class, 'work_start_list_id');
    }

    public function cards(): HasMany
    {
        return $this->hasMany(Card::class);
    }

    public function labels(): HasMany
    {
        return $this->hasMany(Label::class);
    }

    public function discordWebhook(): HasOne
    {
        return $this->hasOne(DiscordWebhook::class);
    }

    public function githubRepositories(): BelongsToMany
    {
        return $this->belongsToMany(GithubRepository::class, 'board_github_repositories')
            ->withPivot(['id', 'sync_direction', 'status_mapping'])
            ->withTimestamps();
    }

    public function trelloImports(): HasMany
    {
        return $this->hasMany(TrelloImport::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->whereNull('archived_at');
    }

    /**
     * @return Collection<int, User>
     */
    public function assignableUsers(): Collection
    {
        $this->loadMissing(['owner', 'members.user']);

        $users = collect();

        if ($this->owner) {
            $users->push($this->owner);
        }

        foreach ($this->members as $member) {
            if ($member->role === 'viewer' || ! $member->user) {
                continue;
            }

            $users->push($member->user);
        }

        foreach ($this->projectMemberUsers(assignableOnly: true) as $user) {
            $users->push($user);
        }

        return $users->unique('id')->values();
    }

    /**
     * Users who can be @mentioned on cards in this board.
     *
     * Includes board members, the owner, and project members for team boards.
     *
     * @return Collection<int, User>
     */
    public function mentionableUsers(): Collection
    {
        $this->loadMissing(['owner', 'members.user']);

        $users = collect();

        if ($this->owner) {
            $users->push($this->owner);
        }

        foreach ($this->members as $member) {
            if ($member->user) {
                $users->push($member->user);
            }
        }

        foreach ($this->projectMemberUsers() as $user) {
            $users->push($user);
        }

        return $users->unique('id')->values();
    }

    /**
     * @return Collection<int, User>
     */
    protected function projectMemberUsers(bool $assignableOnly = false): Collection
    {
        if (! $this->project_id) {
            return collect();
        }

        $query = ProjectMember::query()
            ->where('project_id', $this->project_id)
            ->with('user');

        if ($assignableOnly) {
            $query->where('role', '!=', 'viewer');
        }

        return $query->get()
            ->map(fn (ProjectMember $member) => $member->user)
            ->filter()
            ->values();
    }

    /**
     * @return list<array{id: int, name: string, avatar: string|null}>
     */
    public function mentionableUsersPayload(): array
    {
        return $this->mentionableUsers()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar,
            ])
            ->values()
            ->all();
    }

    public function canAssignWorkTo(User $user): bool
    {
        return $this->assignableUsers()->contains('id', $user->id);
    }
}
