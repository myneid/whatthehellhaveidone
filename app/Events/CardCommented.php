<?php

namespace App\Events;

use App\Models\Card;
use App\Models\CardComment;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CardCommented implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly Card $card,
        public readonly CardComment $comment,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('card.'.$this->card->id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'comment' => [
                'id' => $this->comment->id,
                'body' => $this->comment->body,
                'user' => $this->comment->user,
            ],
        ];
    }
}
