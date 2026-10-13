<?php

namespace App\Traits;

use App\Models\Scopes\TeamScope;
use App\Models\Team;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

trait BelongsToTeam
{
    /**
     * Boot the trait to attach the global scope and automatically fill team_id on create.
     */
    public static function bootBelongsToTeam(): void
    {
        static::addGlobalScope(new TeamScope);

        static::creating(function ($model) {
            if (is_null($model->team_id) && Auth::hasUser() && Auth::user()->current_team_id) {
                $model->team_id = Auth::user()->current_team_id;
            }
        });
    }

    /**
     * The team that owns this model.
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
