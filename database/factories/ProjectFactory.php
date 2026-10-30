<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        return [
            'owner_id' => User::factory(),
            'name' => fake()->sentence(3),
            'slug' => fn (array $attributes) => Str::slug($attributes['name']).'-'.Str::random(6),
            'description' => fake()->optional()->paragraph(),
            'color' => fake()->hexColor(),
            'hashtag_aliases' => [],
            'mcp_enabled' => false,
        ];
    }
}
