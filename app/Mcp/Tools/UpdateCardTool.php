<?php

namespace App\Mcp\Tools;

use App\Models\Card;
use App\Services\ActivityLogService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Database\Eloquent\ModelNotFoundException;
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

    /**
     * Fields a client may clear by supplying null.
     *
     * @var list<string>
     */
    private const CLEARABLE = ['description', 'due_at'];

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

        try {
            $card = Card::findOrFail($request->get('card_id'));
        } catch (ModelNotFoundException) {
            return Response::error('Card not found: '.$request->get('card_id').'.');
        }

        $user = $request->user();

        if (! $user->can('update', $card)) {
            return Response::error('Permission denied.');
        }

        // Key presence, not truthiness: an explicitly supplied null clears a nullable field.
        $changes = [];

        foreach (self::UPDATABLE as $field) {
            if (! $request->has($field)) {
                continue;
            }

            $value = $request->get($field);

            // An empty string reaches here from clients that cannot send a JSON null.
            // Treat it as a clear request so it does not hit the datetime cast and 500.
            if ($value === '' && in_array($field, self::CLEARABLE, true)) {
                $value = null;
            }

            $changes[$field] = $value;
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
            'description' => $schema->string()->nullable()
                ->description('New description. Pass null or an empty string to clear it.'),
            'priority' => $schema->string()
                ->enum(['low', 'medium', 'high', 'urgent', 'none'])
                ->description('One of low, medium, high, urgent, none.'),
            'due_at' => $schema->string()->nullable()
                ->description('Due date/time. Pass null or an empty string to clear it.'),
        ];
    }
}
