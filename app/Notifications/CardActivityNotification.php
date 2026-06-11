<?php

namespace App\Notifications;

use App\Models\Card;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class CardActivityNotification extends Notification
{
    use Queueable;

    public function __construct(
        public readonly Card $card,
        public readonly string $action,
        public readonly ?User $actor,
        public readonly string $actorName,
        public readonly ?string $detail = null,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /** @return array<string, mixed> */
    public function toDatabase(object $notifiable): array
    {
        return $this->payload();
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->payload());
    }

    /** @return array<string, mixed> */
    private function payload(): array
    {
        return [
            'card_id' => $this->card->id,
            'card_number' => $this->card->number,
            'card_title' => $this->card->title,
            'action' => $this->action,
            'actor_name' => $this->actorName,
            'detail' => $this->detail,
            'board_slug' => $this->card->board?->slug,
        ];
    }
}
