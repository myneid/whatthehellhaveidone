<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BoardListResource extends JsonResource
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
            'name' => $this->name,
            'position' => $this->position,
            'wip_limit' => $this->wip_limit,
            'github_action' => $this->github_action,
            'archived_at' => $this->archived_at,
            'cards' => CardResource::collection($this->whenLoaded('cards')),
        ];
    }
}
