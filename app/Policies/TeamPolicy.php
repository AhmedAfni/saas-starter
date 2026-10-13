<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\Team;
use App\Models\User;

class TeamPolicy
{
    /**
     * Determine whether the user can view the team.
     */
    public function view(User $user, Team $team): bool
    {
        return $user->belongsToTeam($team);
    }

    /**
     * Determine whether the user can update the team.
     */
    public function update(User $user, Team $team): bool
    {
        return $user->isTeamOwner($team);
    }

    /**
     * Determine whether the user can delete the team.
     */
    public function delete(User $user, Team $team): bool
    {
        return $user->isTeamOwner($team);
    }

    /**
     * Determine whether the user can view team members.
     */
    public function viewMembers(User $user, Team $team): bool
    {
        return $user->belongsToTeam($team);
    }

    /**
     * Determine whether the user can invite members to the team.
     */
    public function invite(User $user, Team $team): bool
    {
        return $user->hasTeamRole($team, [Role::Owner, Role::Admin]);
    }

    /**
     * Determine whether the user can manage team members (change roles, remove members).
     */
    public function manageMembers(User $user, Team $team): bool
    {
        return $user->hasTeamRole($team, [Role::Owner, Role::Admin]);
    }

    /**
     * Determine whether the user can change a member's role.
     */
    public function updateMemberRole(User $user, Team $team, User $member): bool
    {
        if (! $user->hasTeamRole($team, [Role::Owner, Role::Admin])) {
            return false;
        }

        if (! $member->belongsToTeam($team)) {
            return false;
        }

        // The owner cannot be demoted or have their role altered.
        if ($member->isTeamOwner($team)) {
            return false;
        }

        return true;
    }

    /**
     * Determine whether the user can remove a member from the team.
     */
    public function removeMember(User $user, Team $team, User $member): bool
    {
        if (! $user->hasTeamRole($team, [Role::Owner, Role::Admin])) {
            return false;
        }

        if (! $member->belongsToTeam($team)) {
            return false;
        }

        // The owner cannot be removed.
        if ($member->isTeamOwner($team)) {
            return false;
        }

        return true;
    }
}
