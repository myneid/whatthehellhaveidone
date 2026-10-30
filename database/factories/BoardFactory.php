<?php

namespace Database\Factories;

use App\Models\Board;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Board>
 */
class BoardFactory extends Factory
{
    protected $model = Board::class;

    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'owner_id' => User::factory(),
            'name' => fake()->words(3, true),
            'slug' => fn (array $attributes) => Str::slug($attributes['name']).'-'.Str::random(6),
            'description' => fake()->optional()->sentence(),
            'visibility' => 'private',
            'background_color' => '#6366f1',
        ];
    }
}
