<?php

namespace App\Models;

use App\Traits\BelongsToTeam;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use BelongsToTeam, HasFactory;

    protected $fillable = [
        'name',
        'team_id',
    ];
}
