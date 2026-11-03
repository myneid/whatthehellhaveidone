<?php

namespace App\Mcp\Tools;

use App\Models\Card;
use App\Services\ActivityLogService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Update an existing card. Requires card_id plus at least one of title, description, priority, due_at. Only supplied fields change; an explicit null clears description or due_at. Use move-card-tool to change a card\'s list.')]
class UpdateCardTool extends Tool
{
    /**
     * Fields this tool may patch, matching the fields the web card update tracks.
     *
     * @var list<string>
     */
    private const UPDATABLE = ['title', 'description', 'priority', 'due_at'];

    public function __construct(private readonly ActivityLogService $activityLog) {}

    public function handle(Request $request): Response
    {
        $request->validate([
            'card_id' => ['required', 'integer'],
            'title' => ['sometimes', 'required', 'string', 'max:500'],
            'description' => ['sometimes', 'nullable', 'string'],
            'priority' => ['sometimes', 'required', 'in:low,medium,high,urgent,none'],
            'due_at' => ['sometimes', 'nullable', 'date'],
        ]);

        $card = Card::findOrFail($request->get('card_id'));
        $user = $request->user();

        if (! $user->can('update', $card)) {
            return Response::error('Permission denied.');
        }

        // Key presence, not truthiness: an explicitly supplied null clears a nullable field.
        $changes = [];

        foreach (self::UPDATABLE as $field) {
            if ($request->has($field)) {
                $changes[$field] = $request->get($field);
            }
        }

        if ($changes === []) {
            return Response::error(
                'No updatable fields supplied. Provide at least one of: '.implode(', ', self::UPDATABLE).'.'
            );
        }

        $oldValues = $card->only(array_keys($changes));

        $card->update($changes);

        $this->activityLog->log(
            $card,
            'card_updated',
            old: $oldValues,
            new: $card->fresh()->only(array_keys($changes)),
            actor: $user,
        );

        return Response::text(
            "Card updated: {$card->number} - {$card->title} (changed: ".implode(', ', array_keys($changes)).')'
        );
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'card_id' => $schema->integer()->required()
                ->description('ID of the card to update.'),
            'title' => $schema->string()
                ->description('New title. Cannot be null or empty.'),
            'description' => $schema->string()
                ->description('New description. Pass null to clear it.'),
            'priority' => $schema->string()
                ->description('One of low, medium, high, urgent, none.'),
            'due_at' => $schema->string()
                ->description('Due date/time. Pass null to clear it.'),
        ];
    }
}
