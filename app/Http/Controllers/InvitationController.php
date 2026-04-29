<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use App\Services\ProjectInvitationAcceptanceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvitationController extends Controller
{
    public function __construct(private readonly ProjectInvitationAcceptanceService $projectInvitationAcceptanceService) {}

    public function show(Request $request, string $token): Response|RedirectResponse
    {
        $invitation = Invitation::with(['project', 'invitedBy'])
            ->where('token', $token)
            ->first();

        if (! $invitation || ! $invitation->isPending()) {
            return Inertia::render('invitations/invalid', [
                'reason' => $invitation?->accepted_at ? 'already_accepted' : 'expired',
            ]);
        }

        $continue = $request->string('continue')->value();

        if (! $request->user() && in_array($continue, ['login', 'register'], true)) {
            $request->session()->put('invitation_token', $token);

            return redirect()->route($continue, ['email' => $invitation->email])
                ->with('status', "Please log in or register to accept your invitation to {$invitation->project->name}.");
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
        $user = $request->user();

        if (! $user) {
            $request->session()->put('invitation_token', $token);

            return redirect()->route('login')
                ->with('status', 'Please log in or register to accept your invitation.');
        }

        $result = $this->projectInvitationAcceptanceService->accept($user, $token);

        abort_if($result['status'] === 'invalid', 404);

        $invitation = $result['invitation'];

        if ($result['status'] === 'email_mismatch') {
            return back()->withErrors([
                'error' => "This invitation was sent to {$invitation?->email}. Please log in with that account.",
            ]);
        }

        return redirect()->route('projects.show', $invitation->project)
            ->with('success', "You've joined {$invitation->project->name}!");
    }
}
