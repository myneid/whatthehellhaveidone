<?php

namespace App\Services;

use App\Models\Invitation;
use App\Models\ProjectMember;
use App\Models\User;

class ProjectInvitationAcceptanceService
{
    /**
     * @return array{status: 'accepted' | 'email_mismatch' | 'invalid', invitation: Invitation | null}
     */
    public function accept(User $user, string $token): array
    {
        $invitation = Invitation::with('project')
            ->where('token', $token)
            ->first();

        if (! $invitation || ! $invitation->isPending()) {
            return [
                'status' => 'invalid',
                'invitation' => $invitation,
            ];
        }

        if (strtolower($user->email) !== strtolower($invitation->email)) {
            return [
                'status' => 'email_mismatch',
                'invitation' => $invitation,
            ];
        }

        ProjectMember::firstOrCreate(
            [
                'project_id' => $invitation->project_id,
                'user_id' => $user->id,
            ],
            [
                'role' => $invitation->role,
            ],
        );

        $invitation->update(['accepted_at' => now()]);

        return [
            'status' => 'accepted',
            'invitation' => $invitation,
        ];
    }
}
