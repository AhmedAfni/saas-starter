<?php

use App\Models\Project;
use App\Models\Scopes\TeamScope;
use App\Models\Team;
use App\Models\User;

test('new user registration automatically creates personal team with owner role', function () {
    $this->post('/register', [
        'name' => 'Alice Doe',
        'email' => 'alice@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $user = User::where('email', 'alice@example.com')->first();

    expect($user)->not->toBeNull()
        ->and($user->current_team_id)->not->toBeNull()
        ->and($user->teams)->toHaveCount(1)
        ->and($user->currentTeam->name)->toBe("Alice's Team")
        ->and($user->teamRole($user->currentTeam))->toBe('owner');
});

test('a user can switch between teams they belong to', function () {
    $user = User::factory()->withPersonalTeam('First Team')->create();
    $secondTeam = Team::create(['name' => 'Second Team']);
    $user->teams()->attach($secondTeam->id, ['role' => 'member']);

    expect($user->currentTeam->name)->toBe('First Team');

    $response = $this->actingAs($user)->put('/teams/current', [
        'team_id' => $secondTeam->id,
    ]);

    $response->assertSessionHasNoErrors();
    expect($user->fresh()->current_team_id)->toBe($secondTeam->id);
});

test('a user cannot switch to a team they do not belong to', function () {
    $user = User::factory()->withPersonalTeam('Alpha Team')->create();
    $otherTeam = Team::create(['name' => 'Bravo Team']);

    $response = $this->actingAs($user)->put('/teams/current', [
        'team_id' => $otherTeam->id,
    ]);

    $response->assertStatus(403);
    expect($user->fresh()->current_team_id)->toBe($user->current_team_id);
});

test('belongs to team global scope ensures strict tenant isolation', function () {
    $alice = User::factory()->withPersonalTeam('Alice Corp')->create();
    $bob = User::factory()->withPersonalTeam('Bob Inc')->create();

    // Alice creates a project
    $this->actingAs($alice);
    $aliceProject = Project::create(['name' => 'Alice Confidential Roadmap']);

    expect($aliceProject->team_id)->toBe($alice->current_team_id);

    // Bob creates a project
    $this->actingAs($bob);
    $bobProject = Project::create(['name' => 'Bob Secret Plans']);

    expect($bobProject->team_id)->toBe($bob->current_team_id);

    // Bob cannot see Alice's project
    $bobProjects = Project::all();
    expect($bobProjects)->toHaveCount(1)
        ->and($bobProjects->first()->name)->toBe('Bob Secret Plans')
        ->and(Project::where('id', $aliceProject->id)->first())->toBeNull();

    // Alice cannot see Bob's project
    $this->actingAs($alice);
    $aliceProjects = Project::all();
    expect($aliceProjects)->toHaveCount(1)
        ->and($aliceProjects->first()->name)->toBe('Alice Confidential Roadmap')
        ->and(Project::where('id', $bobProject->id)->first())->toBeNull();
});

test('switching teams changes visible tenant data', function () {
    $user = User::factory()->withPersonalTeam('Team 1')->create();
    $team2 = Team::create(['name' => 'Team 2']);
    $user->teams()->attach($team2->id, ['role' => 'member']);

    $this->actingAs($user);
    $project1 = Project::create(['name' => 'Team 1 Project']);

    $user->switchTeam($team2);
    $this->actingAs($user->fresh());
    $project2 = Project::create(['name' => 'Team 2 Project']);

    // Under Team 2 context, only Team 2 Project is visible
    expect(Project::all()->pluck('name')->all())->toBe(['Team 2 Project']);

    // Switch back to Team 1 context
    $user->switchTeam($user->teams()->first());
    $this->actingAs($user->fresh());

    expect(Project::all()->pluck('name')->all())->toBe(['Team 1 Project']);
});

test('tenant global scope can be bypassed explicitly when required', function () {
    $team1 = Team::create(['name' => 'Team 1']);
    $team2 = Team::create(['name' => 'Team 2']);

    Project::create(['name' => 'P1', 'team_id' => $team1->id]);
    Project::create(['name' => 'P2', 'team_id' => $team2->id]);

    $user = User::factory()->withPersonalTeam()->create();
    $this->actingAs($user);

    expect(Project::count())->toBe(0);
    expect(Project::withoutGlobalScope(TeamScope::class)->count())->toBe(2);
});
