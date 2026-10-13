<?php

namespace App\Models;

use App\Enums\Role;
use Database\Factories\TeamFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    /** @use HasFactory<TeamFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->withPivot('role')
            ->withTimestamps();
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(Invitation::class);
    }

    /**
     * Get the owner user of the team.
     */
    public function owner(): ?User
    {
        return $this->users()->wherePivot('role', Role::Owner->value)->first();
    }

    /**
     * Check if given user is the owner of this team.
     */
    public function isOwner(User $user): bool
    {
        return $user->hasTeamRole($this, Role::Owner);
    }
}
