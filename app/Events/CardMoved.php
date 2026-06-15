<?php

namespace App\Events;

use App\Models\Card;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CardMoved implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly Card $card,
        public readonly int $fromListId,
        public readonly ?User $actor = null,
        public readonly ?string $actorName = null,
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('board.'.$this->card->board_id)];
    }

    /** @return array<string, mixed> */
    public function broadcastWith(): array
    {
        return [
            'card' => [
                'id' => $this->card->id,
                'list_id' => $this->card->list_id,
                'position' => $this->card->position,
            ],
            'actor_name' => $this->actorName ?? $this->actor?->name,
        ];
    }
}
