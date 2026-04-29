<?php

use App\Filament\Resources\Users\Pages\EditUser;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Livewire\Livewire;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

it('allows saving a user without changing the password', function () {
    /** @var User $admin */
    $admin = User::factory()->create([
        'is_super_admin' => true,
    ]);

    /** @var User $user */
    $user = User::factory()->create([
        'password' => 'current-password',
        'timezone' => 'UTC',
        'is_super_admin' => false,
    ]);

    $originalPasswordHash = $user->password;

    actingAs($admin);

    Livewire::test(EditUser::class, ['record' => $user->getKey()])
        ->fillForm([
            'name' => 'Updated User',
            'email' => $user->email,
            'email_verified_at' => optional($user->email_verified_at)?->format('Y-m-d H:i:s'),
            'password' => '',
            'two_factor_secret' => $user->two_factor_secret,
            'two_factor_recovery_codes' => $user->two_factor_recovery_codes,
            'two_factor_confirmed_at' => optional($user->two_factor_confirmed_at)?->format('Y-m-d H:i:s'),
            'avatar' => $user->avatar,
            'timezone' => 'Europe/Paris',
            'is_super_admin' => false,
        ])
        ->call('save')
        ->assertHasNoFormErrors();

    $user->refresh();

    expect($user->name)->toBe('Updated User');
    expect($user->timezone)->toBe('Europe/Paris');
    expect($user->password)->toBe($originalPasswordHash);
    expect(Hash::check('current-password', $user->password))->toBeTrue();
});
