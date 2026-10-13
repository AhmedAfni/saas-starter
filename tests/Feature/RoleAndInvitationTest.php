<?php

use App\Enums\Role;
use App\Models\Invitation;
use App\Models\Project;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

test('a member cannot invite or change roles (403)', function () {
    $owner = User::factory()->withPersonalTeam('Alpha Team')->create();
    $team = $owner->currentTeam;

    $member = User::factory()->create();
    $team->users()->attach($member->id, ['role' => Role::Member->value]);

    $otherMember = User::factory()->create();
    $team->users()->attach($otherMember->id, ['role' => Role::Member->value]);

    // Member attempts to invite
    $inviteResponse = $this->actingAs($member)->post("/teams/{$team->id}/invitations", [
        'email' => 'newbie@example.com',
        'role' => Role::Member->value,
    ]);
    $inviteResponse->assertStatus(403);

    // Member attempts to change another member's role
    $roleResponse = $this->actingAs($member)->patch("/teams/{$team->id}/members/{$otherMember->id}", [
        'role' => Role::Admin->value,
    ]);
    $roleResponse->assertStatus(403);

    // Verify other member's role was not changed
    expect($otherMember->teamRole($team))->toBe(Role::Member->value);
});

test('an admin can invite', function () {
    $owner = User::factory()->withPersonalTeam('Bravo Team')->create();
    $team = $owner->currentTeam;

    $admin = User::factory()->create();
    $team->users()->attach($admin->id, ['role' => Role::Admin->value]);
    $admin->switchTeam($team);

    $response = $this->actingAs($admin)->post("/teams/{$team->id}/invitations", [
        'email' => 'colleague@example.com',
        'role' => Role::Member->value,
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $this->assertDatabaseHas('invitations', [
        'team_id' => $team->id,
        'email' => 'colleague@example.com',
        'role' => Role::Member->value,
        'accepted_at' => null,
    ]);
});

test('the owner cannot be removed', function () {
    $owner = User::factory()->withPersonalTeam('Delta Team')->create();
    $team = $owner->currentTeam;

    $admin = User::factory()->create();
    $team->users()->attach($admin->id, ['role' => Role::Admin->value]);
    $admin->switchTeam($team);

    // Admin attempts to remove the owner
    $adminAttempt = $this->actingAs($admin)->delete("/teams/{$team->id}/members/{$owner->id}");
    $adminAttempt->assertStatus(403);

    // Owner attempts to remove themselves
    $ownerAttempt = $this->actingAs($owner)->delete("/teams/{$team->id}/members/{$owner->id}");
    $ownerAttempt->assertStatus(403);

    // Verify owner remains on the team
    expect($team->users()->whereKey($owner->id)->exists())->toBeTrue()
        ->and($owner->teamRole($team))->toBe(Role::Owner->value);
});

test('an expired or used token is rejected', function () {
    $team = Team::factory()->create();

    // Expired invitation
    $expiredInvite = Invitation::factory()->create([
        'team_id' => $team->id,
        'email' => 'expired@example.com',
        'expires_at' => now()->subDay(),
        'accepted_at' => null,
    ]);

    $responseExpired = $this->get("/invitations/{$expiredInvite->token}");
    $responseExpired->assertStatus(400);

    // Used invitation
    $usedInvite = Invitation::factory()->create([
        'team_id' => $team->id,
        'email' => 'used@example.com',
        'expires_at' => now()->addDays(5),
        'accepted_at' => now()->subHour(),
    ]);

    $responseUsed = $this->get("/invitations/{$usedInvite->token}");
    $responseUsed->assertStatus(400);

    // Non-existent token
    $responseNotFound = $this->get('/invitations/non-existent-random-token');
    $responseNotFound->assertStatus(400);
});

test('accepting an invite adds the user to the team with the right role', function () {
    $team = Team::factory()->create();

    $invitation = Invitation::factory()->create([
        'team_id' => $team->id,
        'email' => 'futureadmin@example.com',
        'role' => Role::Admin->value,
        'expires_at' => now()->addDays(7),
        'accepted_at' => null,
    ]);

    $user = User::factory()->create([
        'email' => 'futureadmin@example.com',
    ]);

    // Accepting as the matching user
    $response = $this->actingAs($user)->get("/invitations/{$invitation->token}");

    $response->assertRedirect(route('dashboard'));

    expect($user->fresh()->belongsToTeam($team))->toBeTrue()
        ->and($user->fresh()->teamRole($team))->toBe(Role::Admin->value)
        ->and($user->fresh()->current_team_id)->toBe($team->id)
        ->and($invitation->fresh()->accepted_at)->not->toBeNull();
});

test('an invite cannot be accepted by a user whose email does not match', function () {
    $team = Team::factory()->create();

    $invitation = Invitation::factory()->create([
        'team_id' => $team->id,
        'email' => 'intended@example.com',
        'role' => Role::Member->value,
    ]);

    $wrongUser = User::factory()->create([
        'email' => 'imposter@example.com',
    ]);

    $response = $this->actingAs($wrongUser)->get("/invitations/{$invitation->token}");
    $response->assertStatus(403);

    expect($wrongUser->fresh()->belongsToTeam($team))->toBeFalse()
        ->and($invitation->fresh()->accepted_at)->toBeNull();
});

test('a user cannot manage another team\'s members', function () {
    $ownerA = User::factory()->withPersonalTeam('Team A')->create();
    $teamA = $ownerA->currentTeam;

    $ownerB = User::factory()->withPersonalTeam('Team B')->create();
    $teamB = $ownerB->currentTeam;
    $memberB = User::factory()->create();
    $teamB->users()->attach($memberB->id, ['role' => Role::Member->value]);

    // Owner A attempts to update role of Member B in Team B
    $updateResponse = $this->actingAs($ownerA)->patch("/teams/{$teamB->id}/members/{$memberB->id}", [
        'role' => Role::Admin->value,
    ]);
    $updateResponse->assertStatus(403);

    // Owner A attempts to remove Member B from Team B
    $deleteResponse = $this->actingAs($ownerA)->delete("/teams/{$teamB->id}/members/{$memberB->id}");
    $deleteResponse->assertStatus(403);

    // Owner A attempts to invite to Team B
    $inviteResponse = $this->actingAs($ownerA)->post("/teams/{$teamB->id}/invitations", [
        'email' => 'sneak@example.com',
        'role' => Role::Member->value,
    ]);
    $inviteResponse->assertStatus(403);
});

test('belongs to team trait does not overwrite team_id if already set on create', function () {
    $user = User::factory()->withPersonalTeam('Active Context Team')->create();
    $otherTeam = Team::factory()->create(['name' => 'Explicit Target Team']);

    $this->actingAs($user);

    $project = Project::create([
        'name' => 'Custom Assigned Project',
        'team_id' => $otherTeam->id,
    ]);

    expect($project->team_id)->toBe($otherTeam->id);
});

test('project policy authorizes roles correctly', function () {
    $owner = User::factory()->withPersonalTeam('Project Permissions Team')->create();
    $team = $owner->currentTeam;

    $admin = User::factory()->create();
    $team->users()->attach($admin->id, ['role' => Role::Admin->value]);

    $member = User::factory()->create();
    $team->users()->attach($member->id, ['role' => Role::Member->value]);

    $project = Project::create([
        'name' => 'Roadmap',
        'team_id' => $team->id,
    ]);

    // Member can view and create, but cannot update or delete
    expect(Gate::forUser($member)->allows('view', $project))->toBeTrue()
        ->and(Gate::forUser($member)->allows('update', $project))->toBeFalse()
        ->and(Gate::forUser($member)->allows('delete', $project))->toBeFalse();

    // Admin can view, update, delete
    expect(Gate::forUser($admin)->allows('view', $project))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('update', $project))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('delete', $project))->toBeTrue();

    // Owner can view, update, delete
    expect(Gate::forUser($owner)->allows('view', $project))->toBeTrue()
        ->and(Gate::forUser($owner)->allows('update', $project))->toBeTrue()
        ->and(Gate::forUser($owner)->allows('delete', $project))->toBeTrue();
});
