<?php

use App\Models\Board;
use App\Models\Card;
use App\Models\Label;
use App\Models\Project;
use App\Models\User;
use Database\Seeders\DemoDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('seeds demo projects with boards, lists, labels, and cards for the demo user', function (): void {
    $user = User::factory()->create(['email' => DemoDataSeeder::DEMO_USER_EMAIL]);
    User::factory()->create(['email' => 'other@example.com']);

    $this->seed(DemoDataSeeder::class);

    expect(Project::query()->where('owner_id', $user->id)->count())->toBe(2)
        ->and(Board::query()->where('owner_id', $user->id)->count())->toBe(2)
        ->and(Card::query()->count())->toBe(9)
        ->and(Label::query()->count())->toBe(10);

    $board = Board::query()->where('slug', 'demo-website-sprint')->firstOrFail();

    expect($board->lists()->count())->toBe(5)
        ->and($board->labels()->count())->toBe(5)
        ->and($board->cards()->where('list_id', $board->lists()->where('name', 'In Progress')->value('id'))->exists())->toBeTrue();
});

it('is idempotent when run multiple times', function (): void {
    User::factory()->create(['email' => DemoDataSeeder::DEMO_USER_EMAIL]);

    $this->seed(DemoDataSeeder::class);
    $this->seed(DemoDataSeeder::class);

    expect(Project::count())->toBe(2)
        ->and(Card::count())->toBe(9);
});

it('does nothing when the demo user account does not exist', function (): void {
    User::factory()->create(['email' => 'other@example.com']);

    $this->seed(DemoDataSeeder::class);

    expect(Project::count())->toBe(0)
        ->and(Card::count())->toBe(0);
});

it('does not seed for other users', function (): void {
    User::factory()->create(['email' => DemoDataSeeder::DEMO_USER_EMAIL]);
    User::factory()->create(['email' => 'other@example.com']);

    $this->seed(DemoDataSeeder::class);

    expect(Project::query()->whereHas('owner', fn ($q) => $q->where('email', 'other@example.com'))->count())->toBe(0)
        ->and(Project::query()->whereHas('owner', fn ($q) => $q->where('email', DemoDataSeeder::DEMO_USER_EMAIL))->count())->toBe(2);
});
