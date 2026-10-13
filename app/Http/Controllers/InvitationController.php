<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class InvitationController extends Controller
{
    /**
     * Process or display the invitation accept page.
     */
    public function accept(Request $request, string $token): Response|RedirectResponse
    {
        $invitation = Invitation::with('team')->where('token', $token)->first();

        if (! $invitation) {
            abort(400, 'Invalid invitation token.');
        }

        if ($invitation->isAccepted()) {
            abort(400, 'This invitation has already been accepted.');
        }

        if ($invitation->isExpired()) {
            abort(400, 'This invitation has expired.');
        }

        // If guest, store token and show the accept landing page
        if (! Auth::check()) {
            session(['invitation_token' => $token]);

            return Inertia::render('Invitations/Accept', [
                'invitation' => [
                    'token' => $invitation->token,
                    'team_name' => $invitation->team->name,
                    'email' => $invitation->email,
                    'role' => $invitation->role,
                    'expires_at' => $invitation->expires_at->toIso8601String(),
                ],
            ]);
        }

        $user = $request->user();

        // Enforce: invite can only be accepted by a user whose email matches the invited email
        if (strtolower($user->email) !== strtolower($invitation->email)) {
            abort(403, "This invitation was sent to {$invitation->email}. You are currently signed in as {$user->email}.");
        }

        // Mark as accepted and attach member if not already on the team
        $invitation->update([
            'accepted_at' => now(),
        ]);

        if (! $user->belongsToTeam($invitation->team)) {
            $invitation->team->users()->attach($user->id, [
                'role' => $invitation->role,
            ]);
        }

        $user->switchTeam($invitation->team);
        session()->forget('invitation_token');

        return redirect()->route('dashboard')->with('status', "You have joined {$invitation->team->name} as {$invitation->role}!");
    }

    /**
     * Handle explicit acceptance POST requests.
     */
    public function storeAccept(Request $request, string $token): RedirectResponse
    {
        return $this->accept($request, $token);
    }
}
