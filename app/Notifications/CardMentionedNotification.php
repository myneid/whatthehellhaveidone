<?php

namespace App\Notifications;

use App\Models\Card;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CardMentionedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public readonly Card $card,
        public readonly User $actor,
        public readonly string $context,
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
            'action' => 'mentioned',
            'actor_name' => $this->actor->name,
            'detail' => "mentioned you in a {$this->context}",
            'board_slug' => $this->card->board?->slug,
        ];
    }
}
