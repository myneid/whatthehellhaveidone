<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
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
            'owner_id' => $this->owner_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'color' => $this->color,
            'hashtag_aliases' => $this->hashtag_aliases,
            'mcp_enabled' => $this->mcp_enabled,
            'archived_at' => $this->archived_at,
            'boards' => BoardResource::collection($this->whenLoaded('boards')),
            'members' => $this->whenLoaded('members'),
            'users' => $this->whenLoaded('users'),
            'work_log_entries' => $this->whenLoaded('work_log_entries'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
