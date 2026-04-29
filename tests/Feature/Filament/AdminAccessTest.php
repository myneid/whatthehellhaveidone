<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

uses(RefreshDatabase::class);

it('allows super admins to access the filament admin panel', function () {
    /** @var User $user */
    $user = User::factory()->create([
        'is_super_admin' => true,
    ]);

    actingAs($user);

    get('/admin')->assertOk();
});

it('blocks non super admins from accessing the filament admin panel', function () {
    /** @var User $user */
    $user = User::factory()->create([
        'is_super_admin' => false,
    ]);

    actingAs($user);

    get('/admin')->assertForbidden();
});
