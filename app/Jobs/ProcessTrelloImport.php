<?php

namespace App\Jobs;

use App\Models\BoardList;
use App\Models\Card;
use App\Models\Checklist;
use App\Models\ChecklistItem;
use App\Models\Label;
use App\Models\TrelloImport;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class ProcessTrelloImport implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly TrelloImport $import,
        public readonly string $storagePath,
    ) {}

    public function handle(): void
    {
        $this->import->update(['status' => 'processing', 'started_at' => now()]);

        try {
            $json = Storage::get($this->storagePath);
            $data = json_decode($json, true);

            if (! $data) {
                throw new \RuntimeException('Failed to decode Trello JSON.');
            }

            DB::transaction(function () use ($data) {
                $this->import($data);
            });

            Storage::delete($this->storagePath);
        } catch (Throwable $e) {
            $this->import->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
                'completed_at' => now(),
            ]);

            throw $e;
        }
    }

    private function import(array $data): void
    {
        $board = $this->import->board;
        $userId = $this->import->user_id;
        $warnings = [];

        // Map Trello label ID -> local Label ID
        $labelMap = [];
        foreach ($data['labels'] ?? [] as $trelloLabel) {
            if (! $trelloLabel['name'] && ! $trelloLabel['color']) {
                continue;
            }

            $color = $this->mapTrelloColor($trelloLabel['color'] ?? '');
            $label = Label::create([
                'board_id' => $board->id,
                'name' => $trelloLabel['name'] ?: ucfirst($trelloLabel['color'] ?? 'Label'),
                'color' => $color,
            ]);
            $labelMap[$trelloLabel['id']] = $label->id;
        }

        // Map Trello list ID -> local BoardList ID
        $listMap = [];
        $position = 1;
        $trelloLists = collect($data['lists'] ?? [])->sortBy('pos');
        foreach ($trelloLists as $trelloList) {
            if ($trelloList['closed'] ?? false) {
                continue;
            }

            $list = BoardList::create([
                'board_id' => $board->id,
                'name' => $trelloList['name'],
                'position' => $position++,
            ]);
            $listMap[$trelloList['id']] = $list->id;
        }

        // Build checklist map: Trello checklist ID -> checklist data
        $trelloChecklists = [];
        foreach ($data['checklists'] ?? [] as $cl) {
            $trelloChecklists[$cl['id']] = $cl;
        }

        // Import cards
        $cardCount = 0;
        $trelloCards = collect($data['cards'] ?? [])
            ->filter(fn ($c) => ! ($c['closed'] ?? false))
            ->sortBy('pos');

        foreach ($trelloCards as $trelloCard) {
            $listId = $listMap[$trelloCard['idList']] ?? null;
            if (! $listId) {
                $warnings[] = "Card \"{$trelloCard['name']}\" skipped — its list was archived.";

                continue;
            }

            $cardPosition = Card::where('list_id', $listId)->max('position') ?? 0;

            $card = Card::create([
                'board_id' => $board->id,
                'list_id' => $listId,
                'creator_id' => $userId,
                'title' => $trelloCard['name'],
                'description' => $trelloCard['desc'] ?: null,
                'position' => $cardPosition + 1,
                'priority' => 'none',
                'due_at' => $trelloCard['due'] ?? null,
                'completed_at' => ($trelloCard['dueComplete'] ?? false) ? ($trelloCard['due'] ?? null) : null,
                'source_system' => 'trello',
                'source_card_id' => $trelloCard['id'],
                'source_board_id' => $data['id'] ?? null,
            ]);

            // Attach labels
            $cardLabelIds = [];
            foreach ($trelloCard['labels'] ?? [] as $trelloLabel) {
                if (isset($labelMap[$trelloLabel['id']])) {
                    $cardLabelIds[] = $labelMap[$trelloLabel['id']];
                }
            }
            if ($cardLabelIds) {
                $card->labels()->attach($cardLabelIds);
            }

            // Import checklists
            $checklistPos = 1;
            foreach ($trelloCard['idChecklists'] ?? [] as $clId) {
                $trelloCl = $trelloChecklists[$clId] ?? null;
                if (! $trelloCl) {
                    continue;
                }

                $checklist = Checklist::create([
                    'card_id' => $card->id,
                    'name' => $trelloCl['name'],
                    'position' => $checklistPos++,
                ]);

                $itemPos = 1;
                $items = collect($trelloCl['checkItems'] ?? [])->sortBy('pos');
                foreach ($items as $item) {
                    ChecklistItem::create([
                        'checklist_id' => $checklist->id,
                        'name' => $item['name'],
                        'is_completed' => ($item['state'] ?? '') === 'complete',
                        'position' => $itemPos++,
                    ]);
                }
            }

            $cardCount++;
        }

        $this->import->update([
            'status' => 'completed',
            'completed_at' => now(),
            'warnings' => $warnings ?: null,
            'summary' => [
                'lists' => count($listMap),
                'labels' => count($labelMap),
                'cards' => $cardCount,
            ],
        ]);
    }

    private function mapTrelloColor(string $color): string
    {
        return match ($color) {
            'green' => '#22c55e',
            'yellow' => '#eab308',
            'orange' => '#f97316',
            'red' => '#ef4444',
            'purple' => '#a855f7',
            'blue' => '#3b82f6',
            'sky' => '#0ea5e9',
            'lime' => '#84cc16',
            'pink' => '#ec4899',
            'black' => '#374151',
            default => '#6b7280',
        };
    }
}
