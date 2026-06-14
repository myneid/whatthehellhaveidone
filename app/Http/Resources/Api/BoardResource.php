<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BoardResource extends JsonResource
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
            'project_id' => $this->project_id,
            'owner_id' => $this->owner_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'visibility' => $this->visibility,
            'background_color' => $this->background_color,
            'copilot_done_list_id' => $this->copilot_done_list_id,
            'done_list_id' => $this->done_list_id,
            'todo_list_id' => $this->todo_list_id,
            'work_start_list_id' => $this->work_start_list_id,
            'archived_at' => $this->archived_at,
            'owner' => new UserResource($this->whenLoaded('owner')),
            'members' => $this->whenLoaded('members'),
            'labels' => LabelResource::collection($this->whenLoaded('labels')),
            'lists' => BoardListResource::collection($this->whenLoaded('lists')),
            'cards' => CardResource::collection($this->whenLoaded('cards')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
