<?php

use App\Models\Invitation;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Fortify\Features;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('invited users are added to the project after registering from an invitation', function () {
    $owner = User::factory()->create();
    $project = Project::create([
        'owner_id' => $owner->id,
        'name' => 'Mercury',
        'slug' => 'mercury-project',
    ]);

    $project->members()->create([
        'user_id' => $owner->id,
        'role' => 'owner',
    ]);

    Invitation::create([
        'project_id' => $project->id,
        'invited_by' => $owner->id,
        'email' => 'new-invitee@example.com',
        'role' => 'viewer',
        'token' => 'register-invitation-token',
        'expires_at' => now()->addDays(7),
    ]);

    $this->get(route('invitations.show', ['token' => 'register-invitation-token']).'?continue=register')
        ->assertRedirect(route('register', ['email' => 'new-invitee@example.com'], absolute: false));

    $response = $this->post(route('register.store'), [
        'name' => 'New Invitee',
        'email' => 'new-invitee@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $invitee = User::where('email', 'new-invitee@example.com')->firstOrFail();

    $this->assertAuthenticatedAs($invitee);
    $response->assertRedirect(route('projects.show', $project, absolute: false));
    $this->assertDatabaseHas('project_members', [
        'project_id' => $project->id,
        'user_id' => $invitee->id,
        'role' => 'viewer',
    ]);
});
