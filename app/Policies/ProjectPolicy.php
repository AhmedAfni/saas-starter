<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    /**
     * Determine whether the user can view any projects.
     */
    public function viewAny(User $user): bool
    {
        return $user->current_team_id !== null;
    }

    /**
     * Determine whether the user can view the project.
     * All team roles (owner, admin, member) can view projects.
     */
    public function view(User $user, Project $project): bool
    {
        return $user->belongsToTeam($project->team);
    }

    /**
     * Determine whether the user can create projects.
     * All team roles (owner, admin, member) can create projects.
     */
    public function create(User $user): bool
    {
        return $user->currentTeam !== null && $user->belongsToTeam($user->currentTeam);
    }

    /**
     * Determine whether the user can update the project.
     * Only owner and admin can manage projects; members cannot.
     */
    public function update(User $user, Project $project): bool
    {
        return $user->belongsToTeam($project->team)
            && $user->hasTeamRole($project->team, [Role::Owner, Role::Admin]);
    }

    /**
     * Determine whether the user can delete the project.
     * Only owner and admin can manage projects; members cannot.
     */
    public function delete(User $user, Project $project): bool
    {
        return $user->belongsToTeam($project->team)
            && $user->hasTeamRole($project->team, [Role::Owner, Role::Admin]);
    }
}
