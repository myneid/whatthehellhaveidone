<?php

namespace App\Services;

use App\Models\Card;
use App\Models\User;
use App\Notifications\CardMentionedNotification;

class MentionService
{
    public function notifyMentions(Card $card, User $actor, string $text, string $context): void
    {
        preg_match_all('/@([\w][^\s@]*(?:\s[\w][^\s@]*)*)/u', $text, $matches);

        if (empty($matches[1])) {
            return;
        }

        $names = array_map('trim', $matches[1]);

        $mentionableUsers = $card->board->mentionableUsers();

        foreach ($names as $name) {
            $mentioned = $mentionableUsers->first(
                fn (User $u) => mb_strtolower($u->name) === mb_strtolower($name)
            );

            if ($mentioned && $mentioned->id !== $actor->id) {
                $mentioned->notify(new CardMentionedNotification($card, $actor, $context));
            }
        }
    }
}
