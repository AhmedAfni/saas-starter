<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Http\Requests\StoreTeamRequest;
use App\Http\Requests\UpdateTeamRequest;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    /**
     * Store a newly created team workspace.
     */
    public function store(StoreTeamRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $team = Team::create([
            'name' => $validated['name'],
        ]);

        $team->users()->attach($request->user()->id, [
            'role' => Role::Owner->value,
        ]);

        $request->user()->forceFill([
            'current_team_id' => $team->id,
        ])->save();

        return redirect()->route('dashboard')->with('status', "Team '{$team->name}' created successfully.");
    }

    /**
     * Show the team settings page for renaming.
     */
    public function edit(Request $request, Team $team): Response
    {
        Gate::authorize('rename', $team);

        return Inertia::render('Teams/Settings', [
            'team' => [
                'id' => $team->id,
                'name' => $team->name,
            ],
            'isOwner' => $request->user()->isTeamOwner($team),
        ]);
    }

    /**
     * Update the team's name.
     */
    public function update(Request $request, Team $team): RedirectResponse
    {
        Gate::authorize('rename', $team);

        $validated = $request->validate((new UpdateTeamRequest)->rules());

        $team->update([
            'name' => $validated['name'],
        ]);

        return back()->with('status', "Team renamed to '{$team->name}'.");
    }
}
