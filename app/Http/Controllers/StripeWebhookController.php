<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\WebhookEvent;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Laravel\Cashier\Billable;
use Laravel\Cashier\Http\Controllers\WebhookController;
use Symfony\Component\HttpFoundation\Response;

class StripeWebhookController extends WebhookController
{
    /**
     * Handle a Stripe webhook call with idempotency checks.
     */
    public function handleWebhook(Request $request): Response
    {
        $payload = json_decode($request->getContent(), true);
        $eventId = $payload['id'] ?? null;

        if ($eventId && WebhookEvent::where('event_id', $eventId)->exists()) {
            return new Response('Webhook Already Processed', 200);
        }

        try {
            return DB::transaction(function () use ($request, $payload, $eventId) {
                if ($eventId) {
                    WebhookEvent::create([
                        'event_id' => $eventId,
                        'type' => $payload['type'] ?? null,
                        'payload' => json_encode($payload),
                    ]);
                }

                return parent::handleWebhook($request);
            });
        } catch (UniqueConstraintViolationException $e) {
            return new Response('Webhook Already Processed', 200);
        }
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
