<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class TeamScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        if (Auth::hasUser()) {
            $currentTeamId = Auth::user()->current_team_id;

            // Restrict query to the active team. If no team is selected,
            // filter for 0 so other tenants' data is never leaked.
            $builder->where($model->qualifyColumn('team_id'), $currentTeamId ?? 0);
        }
    }
}
