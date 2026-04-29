<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use App\Models\ProjectMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvitationController extends Controller
{
    public function show(string $token): Response|RedirectResponse
    {
        $invitation = Invitation::with(['project', 'invitedBy'])
            ->where('token', $token)
            ->first();

        if (! $invitation || ! $invitation->isPending()) {
            return Inertia::render('invitations/invalid', [
                'reason' => $invitation?->accepted_at ? 'already_accepted' : 'expired',
            ]);
        }

        return Inertia::render('invitations/accept', [
            'invitation' => [
                'token' => $invitation->token,
                'email' => $invitation->email,
                'role' => $invitation->role,
                'project' => $invitation->project->only('id', 'name', 'description'),
                'inviter' => $invitation->invitedBy->only('id', 'name'),
                'expires_at' => $invitation->expires_at,
            ],
        ]);
    }

    public function accept(Request $request, string $token): RedirectResponse
    {
        $invitation = Invitation::with('project')
            ->where('token', $token)
            ->first();

        abort_if(! $invitation || ! $invitation->isPending(), 404);

        $user = $request->user();

        if (! $user) {
            session(['invitation_token' => $token]);

            return redirect()->route('login')
                ->with('status', "Please log in or register to accept your invitation to {$invitation->project->name}.");
        }

        if (strtolower($user->email) !== strtolower($invitation->email)) {
            return back()->withErrors([
                'error' => "This invitation was sent to {$invitation->email}. Please log in with that account.",
            ]);
        }

        $alreadyMember = ProjectMember::where('project_id', $invitation->project_id)
            ->where('user_id', $user->id)
            ->exists();

        if (! $alreadyMember) {
            ProjectMember::create([
                'project_id' => $invitation->project_id,
                'user_id' => $user->id,
                'role' => $invitation->role,
            ]);
        }

        $invitation->update(['accepted_at' => now()]);

        return redirect()->route('projects.show', $invitation->project)
            ->with('success', "You've joined {$invitation->project->name}!");
    }
}
