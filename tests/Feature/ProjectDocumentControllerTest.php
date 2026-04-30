<?php

use App\Models\Project;
use App\Models\ProjectDocument;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

function makeProjectWithOwner(): array
{
    $owner = User::factory()->create();
    $project = Project::create([
        'owner_id' => $owner->id,
        'name' => 'Test Project',
        'slug' => 'test-project',
    ]);
    $project->members()->create(['user_id' => $owner->id, 'role' => 'owner']);

    return [$owner, $project];
}

test('project owner can view documents index', function () {
    [$owner, $project] = makeProjectWithOwner();

    actingAs($owner)
        ->get(route('projects.documents.index', $project))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('projects/documents/index'));
});

test('project owner can create a document', function () {
    [$owner, $project] = makeProjectWithOwner();

    actingAs($owner)
        ->post(route('projects.documents.store', $project), ['title' => 'My Doc'])
        ->assertRedirect();

    expect(ProjectDocument::where('title', 'My Doc')->exists())->toBeTrue();
});

test('project owner can view document edit page', function () {
    [$owner, $project] = makeProjectWithOwner();

    $document = $project->documents()->create([
        'title' => 'Edit Me',
        'slug' => 'edit-me-abc123',
        'creator_id' => $owner->id,
    ]);

    actingAs($owner)
        ->get(route('documents.edit', $document))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('projects/documents/edit'));
});

test('project owner can update a document', function () {
    [$owner, $project] = makeProjectWithOwner();

    $document = $project->documents()->create([
        'title' => 'Old Title',
        'slug' => 'old-title-abc123',
        'creator_id' => $owner->id,
    ]);

    actingAs($owner)
        ->put(route('documents.update', $document), ['title' => 'New Title'])
        ->assertRedirect();

    expect($document->fresh()->title)->toBe('New Title');
});
