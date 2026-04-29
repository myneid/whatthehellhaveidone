<?php

namespace App\Http\Controllers;

use App\Mail\ProjectInvitationMail;
use App\Models\Invitation;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ProjectMemberController extends Controller
{
    public function store(Request $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $request->validate([
            'email' => ['required', 'email'],
            'role' => ['required', 'in:admin,member,viewer'],
        ]);

        $email = strtolower($request->email);

        // If user already exists, add them directly
        $user = User::where('email', $email)->first();
        if ($user) {
            $alreadyMember = ProjectMember::where('project_id', $project->id)
                ->where('user_id', $user->id)
                ->exists();

            if ($alreadyMember) {
                return back()->withErrors(['email' => 'This user is already a member of this project.']);
            }

            ProjectMember::create([
                'project_id' => $project->id,
                'user_id' => $user->id,
                'role' => $request->role,
            ]);

            return back()->with('success', "{$user->name} has been added to the project.");
        }

        // User doesn't exist — create or refresh an invitation
        $existing = Invitation::where('project_id', $project->id)
            ->where('email', $email)
            ->whereNull('accepted_at')
            ->first();

        if ($existing && $existing->expires_at->isFuture()) {
            return back()->withErrors(['email' => 'An invitation has already been sent to this email address.']);
        }

        $invitation = Invitation::updateOrCreate(
            ['project_id' => $project->id, 'email' => $email],
            [
                'invited_by' => $request->user()->id,
                'role' => $request->role,
                'token' => Str::random(64),
                'accepted_at' => null,
                'expires_at' => now()->addDays(7),
            ],
        );

        $invitation->load(['project', 'invitedBy']);
        Mail::to($email)->queue(new ProjectInvitationMail($invitation));

        return back()->with('success', "Invitation sent to {$email}.");
    }

    public function update(Request $request, ProjectMember $projectMember): RedirectResponse
    {
        $this->authorize('update', $projectMember->project);

        $request->validate(['role' => ['required', 'in:admin,member,viewer']]);
        $projectMember->update(['role' => $request->role]);

        return back()->with('success', 'Member role updated.');
    }

    public function destroy(ProjectMember $projectMember): RedirectResponse
    {
        $this->authorize('update', $projectMember->project);

        if ($projectMember->user_id === $projectMember->project->owner_id) {
            return back()->withErrors(['error' => 'Cannot remove the project owner.']);
        }

        $projectMember->delete();

        return back()->with('success', 'Member removed.');
    }
}
