<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['project_id', 'parent_id', 'name', 'slug', 'position', 'archived_at'])]
class DocumentFolder extends Model
{
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

    public function parent(): BelongsTo
    {
        return $this->belongsTo(DocumentFolder::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(DocumentFolder::class, 'parent_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(ProjectDocument::class, 'document_folder_id');
    }

    public function permissions(): HasMany
    {
        return $this->hasMany(DocumentPermission::class, 'subject_id')
            ->where('subject_type', 'folder');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->whereNull('archived_at');
    }
}
