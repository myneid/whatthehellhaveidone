<?php

use App\Models\Board;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('dashboard shares boards and projects for sidebar navigation', function () {
    $user = User::factory()->create();

    $project = Project::create([
        'owner_id' => $user->id,
        'name' => 'Apollo',
        'slug' => 'apollo',
    ]);
    $project->members()->create([
        'user_id' => $user->id,
        'role' => 'owner',
    ]);

    $projectBoard = Board::create([
        'project_id' => $project->id,
        'owner_id' => $user->id,
        'name' => 'Sprint Board',
        'slug' => 'sprint-board',
    ]);
    $projectBoard->members()->create([
        'user_id' => $user->id,
        'role' => 'member',
    ]);

    $standaloneBoard = Board::create([
        'owner_id' => $user->id,
        'name' => 'Personal Board',
        'slug' => 'personal-board',
    ]);
    $standaloneBoard->members()->create([
        'user_id' => $user->id,
        'role' => 'member',
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('navigation.standaloneBoards.0.name', 'Personal Board')
            ->where('navigation.projects.0.name', 'Apollo')
            ->where('navigation.projects.0.boards.0.name', 'Sprint Board'),
        );
});
