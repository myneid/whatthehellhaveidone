<?php

namespace App\Events;

use App\Models\Card;
use App\Models\CardAttachment;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

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
            new \Illuminate\Broadcasting\PrivateChannel("card.{$this->card->id}"),
        ];
    }
}
