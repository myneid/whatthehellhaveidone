<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LabelResource extends JsonResource
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
            'color' => $this->color,
            'description' => $this->description,
            'cards' => $this->whenLoaded('cards'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
