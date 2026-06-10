<?php

namespace App\Services;

use App\Models\Invitation;
use App\Models\Project;

class ProjectInvitationReconciliationService
{
    /**
     * Mark pending invitations as accepted when the invitee is already a project member.
     */
    public function reconcile(Project $project): void
    {
        $project->loadMissing(['members.user']);

        $memberEmails = $project->members
            ->map(fn ($member) => $this->normalizeEmail($member->user?->email))
            ->filter()
            ->unique()
            ->values();

        if ($memberEmails->isEmpty()) {
            return;
        }

        Invitation::query()
            ->where('project_id', $project->id)
            ->whereNull('accepted_at')
            ->get()
            ->each(function (Invitation $invitation) use ($memberEmails): void {
                if ($memberEmails->contains($this->normalizeEmail($invitation->email))) {
                    $invitation->update(['accepted_at' => now()]);
                }
            });
    }

    private function normalizeEmail(?string $email): ?string
    {
        if ($email === null || trim($email) === '') {
            return null;
        }

        return strtolower(trim($email));
    }
}
