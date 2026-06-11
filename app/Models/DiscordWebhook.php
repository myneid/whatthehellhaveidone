<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['board_id', 'name', 'encrypted_webhook_url', 'enabled', 'event_settings', 'last_success_at', 'last_failed_at'])]
#[Hidden(['encrypted_webhook_url'])]
class DiscordWebhook extends Model
{
    /** @var list<string> */
    protected $appends = [
        'events',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'enabled' => 'boolean',
            'event_settings' => 'array',
            'last_success_at' => 'datetime',
            'last_failed_at' => 'datetime',
        ];
    }

    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(DiscordWebhookLog::class, 'board_id', 'board_id');
    }

    protected function events(): Attribute
    {
        return Attribute::get(fn (): array => $this->event_settings ?? [
            'card.created',
            'card.moved',
            'card.commented',
            'card.attachment_added',
        ]);
    }

    protected function isActive(): Attribute
    {
        return Attribute::get(fn (): bool => (bool) $this->enabled);
    }
}
