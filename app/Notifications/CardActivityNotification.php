<?php

namespace App\Notifications;

use App\Models\Card;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CardActivityNotification extends Notification
{
    use Queueable;

    public function __construct(
        public readonly Card $card,
        public readonly string $action,
        public readonly User $actor,
        public readonly ?string $detail = null,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /** @return array<string, mixed> */
    public function toDatabase(object $notifiable): array
    {
        return [
            'card_id' => $this->card->id,
            'card_title' => $this->card->title,
            'action' => $this->action,
            'actor_name' => $this->actor->name,
            'detail' => $this->detail,
            'board_slug' => $this->card->board?->slug,
        ];
    }
}
