<?php

use App\Models\Invitation;
use App\Models\Project;
use App\Models\ProjectGroup;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

uses(RefreshDatabase::class);

it('shows project members, invitations, and groups in filament', function () {
    /** @var User $admin */
    $admin = User::factory()->create([
        'is_super_admin' => true,
    ]);

    /** @var User $owner */
    $owner = User::factory()->create();

    /** @var User $member */
    $member = User::factory()->create([
        'email' => 'member@example.com',
    ]);

    $project = Project::create([
        'owner_id' => $owner->id,
        'name' => 'Saturn',
        'slug' => 'saturn-project',
    ]);

    $project->members()->create([
        'user_id' => $owner->id,
        'role' => 'owner',
    ]);

    $project->members()->create([
        'user_id' => $member->id,
        'role' => 'member',
    ]);

    Invitation::create([
        'project_id' => $project->id,
        'invited_by' => $owner->id,
        'email' => 'pending@example.com',
        'role' => 'viewer',
        'token' => 'filament-project-invite',
        'expires_at' => now()->addDays(7),
    ]);

    ProjectGroup::create([
        'project_id' => $project->id,
        'name' => 'Core Team',
    ]);

    actingAs($admin);

    get("/admin/projects/{$project->id}/edit")
        ->assertOk()
        ->assertSee('Members')
        ->assertSee('Invitations')
        ->assertSee('Groups');
});
