<?php

use App\Models\Board;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;

uses(RefreshDatabase::class);

it('blocks a free user from creating more than one project', function () {
    /** @var User $user */
    $user = User::factory()->create([
        'email_verified_at' => now(),
        'is_full_user' => false,
    ]);

    actingAs($user);

    post(route('projects.store'), ['name' => 'First project', 'description' => 'First'])
        ->assertRedirect();

    post(route('projects.store'), ['name' => 'Second project', 'description' => 'Second'])
        ->assertSessionHas('error', 'Your free plan is limited to 1 project and 2 boards. Upgrade to keep growing.')
        ->assertRedirect();

    expect(Project::where('owner_id', $user->id)->count())->toBe(1);
});

it('blocks a free user from creating more than two boards', function () {
    /** @var User $user */
    $user = User::factory()->create([
        'email_verified_at' => now(),
        'is_full_user' => false,
    ]);

    $project = Project::factory()->create([
        'owner_id' => $user->id,
        'name' => 'Free tier project',
    ]);

    $project->members()->create([
        'user_id' => $user->id,
        'role' => 'owner',
    ]);

    actingAs($user);

    foreach (['Board 1', 'Board 2'] as $boardName) {
        post(route('boards.store'), [
            'name' => $boardName,
            'description' => 'Board',
            'project_id' => $project->id,
            'visibility' => 'private',
        ])->assertRedirect();
    }

    post(route('boards.store'), [
        'name' => 'Board 3',
        'description' => 'Board',
        'project_id' => $project->id,
        'visibility' => 'private',
    ])
        ->assertSessionHas('error', 'Your free plan is limited to 1 project and 2 boards. Upgrade to keep growing.')
        ->assertRedirect();

    expect(Board::where('owner_id', $user->id)->where('project_id', $project->id)->count())->toBe(2);
});

it('allows full users to bypass the free-tier limits', function () {
    /** @var User $user */
    $user = User::factory()->create([
        'email_verified_at' => now(),
        'is_full_user' => true,
    ]);

    actingAs($user);

    post(route('projects.store'), ['name' => 'First project', 'description' => 'First'])
        ->assertRedirect();

    post(route('projects.store'), ['name' => 'Second project', 'description' => 'Second'])
        ->assertRedirect();

    expect(Project::where('owner_id', $user->id)->count())->toBe(2);
});
