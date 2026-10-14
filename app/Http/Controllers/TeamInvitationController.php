<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeamInvitationRequest;
use App\Models\Invitation;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class TeamInvitationController extends Controller
{
    /**
     * Store and send a newly created invitation in storage.
     */
    public function store(Request $request, Team $team): RedirectResponse
    {
        Gate::authorize('invite', $team);

        $validated = $request->validate((new StoreTeamInvitationRequest)->rules());

        if ($team->hasReachedMemberLimit()) {
            throw ValidationException::withMessages([
                'email' => 'Free teams can have a maximum of 3 members (including pending invitations). Please upgrade your plan to invite more teammates.',
            ]);
        }

        if ($team->users()->where('email', $validated['email'])->exists()) {
            throw ValidationException::withMessages([
                'email' => 'This user is already a member of the team.',
            ]);
        }

        $pendingInvitation = $team->invitations()
            ->where('email', $validated['email'])
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->first();

        if ($pendingInvitation) {
            throw ValidationException::withMessages([
                'email' => 'An active invitation for this email has already been sent.',
            ]);
        }

        $invitation = $team->invitations()->create([
            'email' => $validated['email'],
            'role' => $validated['role'],
            'token' => Str::random(40),
            'expires_at' => now()->addDays(7),
        ]);

        $acceptUrl = route('invitations.accept', $invitation->token);
        Log::info("Team invitation sent: Team '{$team->name}' invited '{$invitation->email}' as '{$invitation->role}'. Accept link: {$acceptUrl}");

        return back()->with('status', "Invitation sent to {$invitation->email}.");
    }

    /**
     * Cancel and remove the specified invitation.
     */
    public function destroy(Request $request, Team $team, Invitation $invitation): RedirectResponse
    {
        Gate::authorize('invite', $team);

        if ($invitation->team_id !== $team->id) {
            abort(404);
        }

        $invitation->delete();

        return back()->with('status', 'Invitation cancelled.');
    }
}
