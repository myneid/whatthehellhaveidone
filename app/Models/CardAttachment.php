<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

#[Appends(['url'])]
#[Fillable(['card_id', 'user_id', 'filename', 'path', 'mime_type', 'size', 'disk'])]
class CardAttachment extends Model
{
    const UPDATED_AT = null;

    public function card(): BelongsTo
    {
        return $this->belongsTo(Card::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function url(): Attribute
    {
        return Attribute::make(
            get: function (): string {
                $disk = Storage::disk($this->disk);

                if (method_exists($disk, 'url')) {
                    return $disk->url($this->path);
                }

                return Storage::url($this->path);
            },
        );
    }
}
