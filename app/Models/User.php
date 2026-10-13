<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\Role;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'current_team_id'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Teams the user belongs to.
     */
    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class)
            ->withPivot('role')
            ->withTimestamps();
    }

    /**
     * The user's currently active team context.
     */
    public function currentTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'current_team_id');
    }

    /**
     * Check if user is a member of the given team.
     */
    public function belongsToTeam(Team $team): bool
    {
        return $this->teams()->whereKey($team->id)->exists();
    }

    /**
     * Switch current team context to another team the user belongs to.
     */
    public function switchTeam(Team $team): bool
    {
        if (! $this->belongsToTeam($team)) {
            return false;
        }

        $this->forceFill(['current_team_id' => $team->id])->save();

        return true;
    }

    /**
     * Get the user's role on the given team.
     */
    public function teamRole(Team $team): ?string
    {
        return $this->teams()->whereKey($team->id)->first()?->pivot?->role;
    }

    /**
     * Check if user has one of the given roles on the team.
     */
    public function hasTeamRole(Team $team, Role|string|array $roles): bool
    {
        $userRole = $this->teamRole($team);
        if (! $userRole) {
            return false;
        }

        $roles = is_array($roles) ? $roles : [$roles];
        $roleValues = array_map(fn ($r) => $r instanceof Role ? $r->value : $r, $roles);

        return in_array($userRole, $roleValues, true);
    }

    /**
     * Check if the user is the owner of the team.
     */
    public function isTeamOwner(Team $team): bool
    {
        return $this->hasTeamRole($team, Role::Owner);
    }

    /**
     * Check if the user is an admin of the team.
     */
    public function isTeamAdmin(Team $team): bool
    {
        return $this->hasTeamRole($team, Role::Admin);
    }

    /**
     * Create and set a default personal team for the user.
     */
    public function createPersonalTeam(?string $name = null): Team
    {
        $team = Team::create([
            'name' => $name ?? (explode(' ', $this->name, 2)[0]."'s Team"),
        ]);

        $this->teams()->attach($team->id, ['role' => 'owner']);
        $this->forceFill(['current_team_id' => $team->id])->save();

        return $team;
    }
}
