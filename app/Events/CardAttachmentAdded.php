<?php

namespace App\Events;

use App\Models\Card;
use App\Models\CardAttachment;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CardAttachmentAdded
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly Card $card,
        public readonly CardAttachment $attachment,
    ) {}
}
