<?php

namespace Database\Factories;

use App\Enums\Role;
use App\Models\Invitation;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Invitation>
 */
class InvitationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'team_id' => Team::factory(),
            'email' => fake()->unique()->safeEmail(),
            'role' => Role::Member->value,
            'token' => Str::random(40),
            'expires_at' => now()->addDays(7),
            'accepted_at' => null,
        ];
    }

    /**
     * Indicate that the invitation is expired.
     */
    public function expired(): static
    {
        return $this->state(fn () => [
            'expires_at' => now()->subDay(),
        ]);
    }

    /**
     * Indicate that the invitation is already accepted.
     */
    public function accepted(): static
    {
        return $this->state(fn () => [
            'accepted_at' => now()->subDay(),
        ]);
    }
}
