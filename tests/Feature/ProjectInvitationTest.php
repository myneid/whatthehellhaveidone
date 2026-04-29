<?php

use App\Mail\ProjectInvitationMail;
use App\Models\Invitation;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

test('project page shows pending invitations', function () {
    $owner = User::factory()->create();
    $project = Project::create([
        'owner_id' => $owner->id,
        'name' => 'Apollo',
        'slug' => 'apollo-project',
    ]);

    $project->members()->create([
        'user_id' => $owner->id,
        'role' => 'owner',
    ]);

    $invitation = Invitation::create([
        'project_id' => $project->id,
        'invited_by' => $owner->id,
        'email' => 'invitee@example.com',
        'role' => 'viewer',
        'token' => 'pending-invitation-token',
        'expires_at' => now()->addDays(3),
    ]);

    actingAs($owner)
        ->get(route('projects.show', $project))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('projects/show')
            ->where('project.invitations.0.email', $invitation->email)
            ->where('project.invitations.0.role', $invitation->role)
            ->where('project.invitations.0.inviter.name', $owner->name)
            ->where('project.invitations.0.is_expired', false)
            ->where('project.invitations.0.accept_url', route('invitations.show', ['token' => $invitation->token])),
        );
});

test('project owners can resend pending invitations', function () {
    Mail::fake();

    $owner = User::factory()->create();
    $project = Project::create([
        'owner_id' => $owner->id,
        'name' => 'Resend Project',
        'slug' => 'resend-project',
    ]);

    $project->members()->create([
        'user_id' => $owner->id,
        'role' => 'owner',
    ]);

    $invitation = Invitation::create([
        'project_id' => $project->id,
        'invited_by' => $owner->id,
        'email' => 'invitee@example.com',
        'role' => 'member',
        'token' => 'stale-token',
        'expires_at' => now()->subDay(),
    ]);

    actingAs($owner)
        ->post(route('projects.invitations.resend', ['project' => $project, 'invitation' => $invitation]))
        ->assertRedirect()
        ->assertSessionHas('success', 'Invitation resent to invitee@example.com.');

    $invitation->refresh();

    expect($invitation->token)->not->toBe('stale-token');
    expect($invitation->expires_at->isFuture())->toBeTrue();

    Mail::assertQueued(ProjectInvitationMail::class, function (ProjectInvitationMail $mail) use ($invitation) {
        return $mail->hasTo($invitation->email) && $mail->invitation->is($invitation);
    });
});
