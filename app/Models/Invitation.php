<?php

namespace App\Models;

use App\Enums\Role;
use Database\Factories\InvitationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Invitation extends Model
{
    /** @use HasFactory<InvitationFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'team_id',
        'email',
        'role',
        'token',
        'expires_at',
        'accepted_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'accepted_at' => 'datetime',
        ];
    }

    /**
     * Boot model to automatically generate random token and 7-day expiration.
     */
    protected static function booted(): void
    {
        static::creating(function (Invitation $invitation) {
            if (empty($invitation->token)) {
                $invitation->token = Str::random(40);
            }

            if (empty($invitation->expires_at)) {
                $invitation->expires_at = now()->addDays(7);
            }

            if (empty($invitation->role)) {
                $invitation->role = Role::Member->value;
            }
        });
    }

    /**
     * Team the invitation belongs to.
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Determine if invitation is expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Determine if invitation has already been accepted.
     */
    public function isAccepted(): bool
    {
        return $this->accepted_at !== null;
    }

    /**
     * Determine if invitation is still valid.
     */
    public function isValid(): bool
    {
        return ! $this->isExpired() && ! $this->isAccepted();
    }
}
