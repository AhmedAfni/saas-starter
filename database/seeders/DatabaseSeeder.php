<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\Project;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $commonPassword = Hash::make('password');

        // Team 1: Acme Corp
        $acmeTeam = Team::create([
            'name' => 'Acme Corp',
        ]);

        $aliceOwner = User::create([
            'name' => 'Alice Owner',
            'email' => 'owner@acme.com',
            'password' => $commonPassword,
            'email_verified_at' => now(),
            'current_team_id' => $acmeTeam->id,
        ]);
        $acmeTeam->users()->attach($aliceOwner->id, ['role' => Role::Owner->value]);

        $bobAdmin = User::create([
            'name' => 'Bob Admin',
            'email' => 'admin@acme.com',
            'password' => $commonPassword,
            'email_verified_at' => now(),
            'current_team_id' => $acmeTeam->id,
        ]);
        $acmeTeam->users()->attach($bobAdmin->id, ['role' => Role::Admin->value]);

        $charlieMember = User::create([
            'name' => 'Charlie Member',
            'email' => 'member@acme.com',
            'password' => $commonPassword,
            'email_verified_at' => now(),
            'current_team_id' => $acmeTeam->id,
        ]);
        $acmeTeam->users()->attach($charlieMember->id, ['role' => Role::Member->value]);

        Project::create(['name' => 'Acme Website Redesign', 'team_id' => $acmeTeam->id]);
        Project::create(['name' => 'Acme Mobile App', 'team_id' => $acmeTeam->id]);
        Project::create(['name' => 'Acme Analytics Engine', 'team_id' => $acmeTeam->id]);

        // Team 2: Stark Industries
        $starkTeam = Team::create([
            'name' => 'Stark Industries',
        ]);

        $tonyOwner = User::create([
            'name' => 'Tony Owner',
            'email' => 'owner@stark.com',
            'password' => $commonPassword,
            'email_verified_at' => now(),
            'current_team_id' => $starkTeam->id,
        ]);
        $starkTeam->users()->attach($tonyOwner->id, ['role' => Role::Owner->value]);

        $pepperAdmin = User::create([
            'name' => 'Pepper Admin',
            'email' => 'admin@stark.com',
            'password' => $commonPassword,
            'email_verified_at' => now(),
            'current_team_id' => $starkTeam->id,
        ]);
        $starkTeam->users()->attach($pepperAdmin->id, ['role' => Role::Admin->value]);

        $peterMember = User::create([
            'name' => 'Peter Member',
            'email' => 'member@stark.com',
            'password' => $commonPassword,
            'email_verified_at' => now(),
            'current_team_id' => $starkTeam->id,
        ]);
        $starkTeam->users()->attach($peterMember->id, ['role' => Role::Member->value]);

        Project::create(['name' => 'Jarvis AI Core', 'team_id' => $starkTeam->id]);
        Project::create(['name' => 'Arc Reactor Interface', 'team_id' => $starkTeam->id]);
        Project::create(['name' => 'Mark 85 Telemetry', 'team_id' => $starkTeam->id]);

        // Output demo login credentials
        if ($this->command) {
            $this->command->info('');
            $this->command->info('===============================================================');
            $this->command->info('                DEMO ACCOUNTS SEEDED SUCCESSFULLY               ');
            $this->command->info('===============================================================');
            $this->command->table(
                ['Team', 'Role', 'Name', 'Email', 'Password'],
                [
                    ['Acme Corp', 'Owner', 'Alice Owner', 'owner@acme.com', 'password'],
                    ['Acme Corp', 'Admin', 'Bob Admin', 'admin@acme.com', 'password'],
                    ['Acme Corp', 'Member', 'Charlie Member', 'member@acme.com', 'password'],
                    ['-----------------', '-------', '-----------------', '------------------', '--------'],
                    ['Stark Industries', 'Owner', 'Tony Owner', 'owner@stark.com', 'password'],
                    ['Stark Industries', 'Admin', 'Pepper Admin', 'admin@stark.com', 'password'],
                    ['Stark Industries', 'Member', 'Peter Member', 'member@stark.com', 'password'],
                ]
            );
            $this->command->info('===============================================================');
        }
    }
}
