<?php

namespace App\Events;

use App\Models\Card;
use App\Models\CardAttachment;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CardAttachmentAdded implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly Card $card,
        public readonly CardAttachment $attachment,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('card.'.$this->card->id),
        ];
    }
}
