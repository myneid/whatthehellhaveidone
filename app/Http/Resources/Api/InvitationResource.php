<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvitationResource extends JsonResource
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
            'invited_by' => $this->invitedBy,
            'email' => $this->email,
            'role' => $this->role,
            'token' => $this->when($this->isPending(), 'token'),
            'accepted_at' => $this->accepted_at,
            'expires_at' => $this->expires_at,
            'is_pending' => $this->isPending(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
