<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\WebhookEvent;
use Illuminate\Http\Request;
use Laravel\Cashier\Billable;
use Laravel\Cashier\Http\Controllers\WebhookController;
use Symfony\Component\HttpFoundation\Response;

class StripeWebhookController extends WebhookController
{
    /**
     * Handle a Stripe webhook call with idempotency checks.
     */
    public function handleWebhook(Request $request)
    {
        $payload = json_decode($request->getContent(), true);
        $eventId = $payload['id'] ?? null;

        if ($eventId) {
            // Check if this Stripe event has already been processed (idempotency guard)
            if (WebhookEvent::where('event_id', $eventId)->exists()) {
                return new Response('Webhook Already Processed', 200);
            }

            try {
                WebhookEvent::create([
                    'event_id' => $eventId,
                    'type' => $payload['type'] ?? null,
                    'payload' => json_encode($payload),
                ]);
            } catch (\Throwable $e) {
                // Caught duplicate key collision on event_id from concurrent requests
                return new Response('Webhook Already Processed', 200);
            }
        }

        return parent::handleWebhook($request);
    }

    /**
     * Get the billable customer instance by Stripe ID without relying on BelongsToTeam scope.
     *
     * @param  string|null  $stripeId
     * @return Billable|null
     */
    protected function getUserByStripeId($stripeId)
    {
        if (! $stripeId) {
            return null;
        }

        // Webhooks have no authenticated user context, so find the Team directly without scopes
        return Team::withoutGlobalScopes()->where('stripe_id', $stripeId)->first();
    }
}
