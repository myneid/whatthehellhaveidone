<?php

namespace App\Events;

use App\Models\Card;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class CardCompleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public readonly Card $card) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('card.'.$this->card->id),
        ];
    }
}
