<?php

use App\Models\Invitation;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Laravel\Fortify\Features;

uses(RefreshDatabase::class);

test('login screen can be rendered', function () {
    $response = $this->get(route('login'));

    $response->assertOk();
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('invited users are added to the project after logging in from an invitation', function () {
    $owner = User::factory()->create();
    $invitee = User::factory()->create([
        'email' => 'invitee@example.com',
    ]);
    $project = Project::create([
        'owner_id' => $owner->id,
        'name' => 'Apollo',
        'slug' => 'apollo-project',
    ]);

    $project->members()->create([
        'user_id' => $owner->id,
        'role' => 'owner',
    ]);

    Invitation::create([
        'project_id' => $project->id,
        'invited_by' => $owner->id,
        'email' => $invitee->email,
        'role' => 'member',
        'token' => 'login-invitation-token',
        'expires_at' => now()->addDays(7),
    ]);

    $this->get(route('invitations.show', ['token' => 'login-invitation-token']).'?continue=login')
        ->assertRedirect(route('login', ['email' => $invitee->email], absolute: false));

    $response = $this->post(route('login.store'), [
        'email' => $invitee->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticatedAs($invitee);
    $response->assertRedirect(route('projects.show', $project, absolute: false));
    $this->assertDatabaseHas('project_members', [
        'project_id' => $project->id,
        'user_id' => $invitee->id,
        'role' => 'member',
    ]);
});

test('users with two factor enabled are redirected to two factor challenge', function () {
    $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);

    $user = User::factory()->create();

    $user->forceFill([
        'two_factor_secret' => encrypt('test-secret'),
        'two_factor_recovery_codes' => encrypt(json_encode(['code1', 'code2'])),
        'two_factor_confirmed_at' => now(),
    ])->save();

    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('two-factor.login'));
    $response->assertSessionHas('login.id', $user->id);
    $this->assertGuest();
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $this->assertGuest();
    $response->assertRedirect(route('home'));
});

test('users are rate limited', function () {
    $user = User::factory()->create();

    RateLimiter::increment(md5('login'.implode('|', [$user->email, '127.0.0.1'])), amount: 5);

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertTooManyRequests();
});
