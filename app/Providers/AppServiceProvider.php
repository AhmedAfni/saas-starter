<?php

namespace App\Providers;

use App\Models\Project;
use App\Models\Team;
use App\Policies\ProjectPolicy;
use App\Policies\TeamPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Team::class, TeamPolicy::class);
        Gate::policy(Project::class, ProjectPolicy::class);

        Vite::prefetch(concurrency: 3);
    }
}
