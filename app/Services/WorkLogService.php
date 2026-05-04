<?php

namespace App\Services;

use App\Models\BoardList;
use App\Models\Card;
use App\Models\User;
use App\Models\WorkLogEntry;
use App\Models\WorkLogProjectAlias;
use App\WorkLogEntryType;
use App\WorkLogSource;

class WorkLogService
{
    public function logCardCreated(Card $card, User $user): WorkLogEntry
    {
        return WorkLogEntry::create([
            'user_id' => $user->id,
            'project_id' => $card->board->project_id,
            'board_id' => $card->board_id,
            'card_id' => $card->id,
            'source' => WorkLogSource::System->value,
            'entry_type' => WorkLogEntryType::CardCreated->value,
            'body' => "Created card: {$card->title}",
        ]);
    }

    public function logCardMoved(Card $card, int $fromListId, User $user): WorkLogEntry
    {
        $fromList = BoardList::find($fromListId);
        $toList = $card->list;

        return WorkLogEntry::create([
            'user_id' => $user->id,
            'project_id' => $card->board->project_id,
            'board_id' => $card->board_id,
            'card_id' => $card->id,
            'source' => WorkLogSource::System->value,
            'entry_type' => WorkLogEntryType::CardMoved->value,
            'body' => "Moved card \"{$card->title}\" from {$fromList?->name} to {$toList?->name}",
            'metadata' => [
                'from_list_id' => $fromListId,
                'to_list_id' => $card->list_id,
            ],
        ]);
    }

    public function logFromHashtags(string $body, User $user, array $extra = []): WorkLogEntry
    {
        ['hashtags' => $hashtags, 'project_id' => $projectId] = $this->extractHashtagsAndProject($body);

        return WorkLogEntry::create([
            'user_id' => $user->id,
            'project_id' => $projectId,
            'source' => WorkLogSource::Manual->value,
            'entry_type' => WorkLogEntryType::Manual->value,
            'body' => $body,
            'hashtags' => $hashtags ?: null,
            ...$extra,
        ]);
    }

    public function updateEntryFromHashtags(WorkLogEntry $entry, string $body, array $extra = []): WorkLogEntry
    {
        ['hashtags' => $hashtags, 'project_id' => $projectId] = $this->extractHashtagsAndProject($body);

        $entry->update([
            'body' => $body,
            'project_id' => $projectId,
            'hashtags' => $hashtags ?: null,
            ...$extra,
        ]);

        return $entry->refresh();
    }

    /**
     * @return array{hashtags: array<int, string>, project_id: int|null}
     */
    private function extractHashtagsAndProject(string $body): array
    {
        preg_match_all('/#([a-zA-Z0-9_-]+)/', $body, $matches);
        $hashtags = array_values(array_unique($matches[1] ?? []));

        $projectId = null;
        if ($hashtags !== []) {
            $alias = WorkLogProjectAlias::whereIn('alias', $hashtags)->first();
            $projectId = $alias?->project_id;
        }

        return [
            'hashtags' => $hashtags,
            'project_id' => $projectId,
        ];
    }
}
