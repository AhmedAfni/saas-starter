<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Models\Invitation;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TeamMemberController extends Controller
{
    /**
     * Display a listing of team members and pending invitations.
     */
    public function index(Request $request, Team $team): Response
    {
        Gate::authorize('viewMembers', $team);

        $members = $team->users()
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->pivot->role,
                'is_owner' => $user->pivot->role === Role::Owner->value,
            ]);

        $invitations = $request->user()->can('invite', $team)
            ? $team->invitations()
                ->whereNull('accepted_at')
                ->where('expires_at', '>', now())
                ->latest()
                ->get()
                ->map(fn (Invitation $invite) => [
                    'id' => $invite->id,
                    'email' => $invite->email,
                    'role' => $invite->role,
                    'expires_at' => $invite->expires_at->toIso8601String(),
                    'accept_url' => route('invitations.accept', $invite->token),
                ])
            : [];

        return Inertia::render('Teams/Members', [
            'team' => [
                'id' => $team->id,
                'name' => $team->name,
            ],
            'members' => $members,
            'invitations' => $invitations,
            'permissions' => [
                'can_invite' => $request->user()->can('invite', $team),
                'can_manage_members' => $request->user()->can('manageMembers', $team),
                'is_owner' => $request->user()->isTeamOwner($team),
            ],
            'availableRoles' => Role::assignableRoles(),
        ]);
    }

    /**
     * Update a member's role on the team.
     */
    public function update(Request $request, Team $team, User $member): RedirectResponse
    {
        Gate::authorize('updateMemberRole', [$team, $member]);

        $validated = $request->validate([
            'role' => ['required', 'string', Rule::in(Role::assignableRoles())],
        ]);

        $team->users()->updateExistingPivot($member->id, [
            'role' => $validated['role'],
        ]);

        return back()->with('status', "{$member->name}'s role was updated to {$validated['role']}.");
    }

    /**
     * Remove a member from the team.
     */
    public function destroy(Request $request, Team $team, User $member): RedirectResponse
    {
        Gate::authorize('removeMember', [$team, $member]);

        $team->users()->detach($member->id);

        if ($member->current_team_id === $team->id) {
            $nextTeam = $member->teams()->first();
            $member->forceFill(['current_team_id' => $nextTeam?->id])->save();
        }

        return back()->with('status', "{$member->name} was removed from the team.");
    }
}
