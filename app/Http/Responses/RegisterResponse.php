<?php

namespace App\Http\Responses;

use App\Services\ProjectInvitationAcceptanceService;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Laravel\Fortify\Fortify;

class RegisterResponse implements RegisterResponseContract
{
    public function __construct(private readonly ProjectInvitationAcceptanceService $projectInvitationAcceptanceService) {}

    public function toResponse($request)
    {
        $redirect = $this->invitationRedirect($request);

        if ($redirect) {
            return $redirect;
        }

        return $request->wantsJson()
            ? new JsonResponse('', 201)
            : redirect()->intended(Fortify::redirects('register'));
    }

    private function invitationRedirect($request)
    {
        $token = $request->session()->pull('invitation_token');

        if (! $token || ! $request->user()) {
            return null;
        }

        $result = $this->projectInvitationAcceptanceService->accept($request->user(), $token);

        if ($result['status'] === 'accepted') {
            return redirect()->route('projects.show', $result['invitation']->project)
                ->with('success', "You've joined {$result['invitation']->project->name}!");
        }

        if ($result['status'] === 'email_mismatch') {
            return redirect()->route('dashboard')
                ->with('error', "This invitation was sent to {$result['invitation']->email}. Please sign in with that account.");
        }

        return null;
    }
}
