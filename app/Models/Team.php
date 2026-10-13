<?php

namespace App\Models;

use App\Enums\Role;
use Database\Factories\TeamFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Cashier\Billable;

class Team extends Model
{
    /** @use HasFactory<TeamFactory> */
    use Billable, HasFactory;

    protected $fillable = [
        'name',
        'stripe_id',
        'pm_type',
        'pm_last_four',
        'trial_ends_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'trial_ends_at' => 'datetime',
        ];
    }

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

    /**
     * Determine if team has an active subscription.
     */
    public function isSubscribed(): bool
    {
        return $this->subscribed();
    }

    /**
     * Total member seats taken: current members + pending active invitations.
     */
    public function totalMemberSeatsTaken(): int
    {
        $membersCount = $this->users()->count();
        $pendingInvitesCount = $this->invitations()
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->count();

        return $membersCount + $pendingInvitesCount;
    }

    /**
     * Check if team has reached its member plan limit.
     * Free teams: max 3 members (including pending invites).
     * Subscribed teams: unlimited.
     */
    public function hasReachedMemberLimit(): bool
    {
        if ($this->isSubscribed()) {
            return false;
        }

        return $this->totalMemberSeatsTaken() >= 3;
    }
}
