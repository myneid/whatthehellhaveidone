<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'board_id' => $this->board_id,
            'list_id' => $this->list_id,
            'number' => $this->number,
            'title' => $this->title,
            'description' => $this->description,
            'priority' => $this->priority,
            'due_at' => $this->due_at,
            'started_at' => $this->started_at,
            'completed_at' => $this->completed_at,
            'archived_at' => $this->archived_at,
            'creator' => new UserResource($this->whenLoaded('creator')),
            'attachments' => CardAttachmentResource::collection($this->whenLoaded('attachments')),
            'comments' => $this->whenLoaded('comments'),
            'checklists' => $this->whenLoaded('checklists'),
            'labels' => $this->whenLoaded('labels'),
            'assignees' => $this->whenLoaded('assignees'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
