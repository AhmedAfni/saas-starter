<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class TeamBillingController extends Controller
{
    /**
     * Display the billing dashboard for the team.
     */
    public function index(Request $request, Team $team): Response
    {
        Gate::authorize('manageBilling', $team);

        if ($request->query('checkout') === 'success') {
            session()->flash('status', 'Your subscription was activated successfully!');
        } elseif ($request->query('checkout') === 'cancelled') {
            session()->flash('status', 'Checkout was cancelled.');
        }

        $subscription = $team->subscription();

        return Inertia::render('Teams/Billing', [
            'team' => [
                'id' => $team->id,
                'name' => $team->name,
                'stripe_id' => $team->stripe_id,
            ],
            'isSubscribed' => $team->isSubscribed(),
            'subscription' => $subscription ? [
                'name' => $subscription->type,
                'stripe_status' => $subscription->stripe_status,
                'stripe_price' => $subscription->stripe_price,
                'ends_at' => $subscription->ends_at?->toIso8601String(),
                'on_grace_period' => $subscription->onGracePeriod(),
            ] : null,
            'memberCount' => $team->users()->count(),
            'totalSeatsTaken' => $team->totalMemberSeatsTaken(),
            'maxFreeSeats' => 3,
            'priceId' => config('services.stripe.price_id'),
        ]);
    }

    /**
     * Initiate a Stripe Checkout session to subscribe.
     */
    public function subscribe(Request $request, Team $team): SymfonyResponse
    {
        Gate::authorize('manageBilling', $team);

        $priceId = config('services.stripe.price_id') ?: 'price_default';

        $checkout = $team->newSubscription('default', $priceId)
            ->checkout([
                'success_url' => route('teams.billing.index', $team).'?checkout=success',
                'cancel_url' => route('teams.billing.index', $team).'?checkout=cancelled',
            ]);

        return Inertia::location($checkout->url);
    }

    /**
     * Redirect to the customer billing portal.
     */
    public function portal(Request $request, Team $team): SymfonyResponse
    {
        Gate::authorize('manageBilling', $team);

        return Inertia::location($team->billingPortalUrl(route('teams.billing.index', $team)));
    }
}
