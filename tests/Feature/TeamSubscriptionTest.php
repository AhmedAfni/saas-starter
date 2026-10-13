<?php

use App\Enums\Role;
use App\Models\Invitation;
use App\Models\Team;
use App\Models\User;
use App\Models\WebhookEvent;
use Illuminate\Support\Facades\Event;
use Laravel\Cashier\Events\WebhookReceived;

test('a non-owner cannot open the billing page', function () {
    $owner = User::factory()->withPersonalTeam('Subscribers Team')->create();
    $team = $owner->currentTeam;

    $admin = User::factory()->create();
    $team->users()->attach($admin->id, ['role' => Role::Admin->value]);

    $member = User::factory()->create();
    $team->users()->attach($member->id, ['role' => Role::Member->value]);

    $stranger = User::factory()->create();

    // Admin attempt
    $this->actingAs($admin)->get("/teams/{$team->id}/billing")->assertStatus(403);

    // Member attempt
    $this->actingAs($member)->get("/teams/{$team->id}/billing")->assertStatus(403);

    // Stranger attempt
    $this->actingAs($stranger)->get("/teams/{$team->id}/billing")->assertStatus(403);

    // Owner attempt
    $this->actingAs($owner)->get("/teams/{$team->id}/billing")->assertStatus(200);
});

test('a free team cannot exceed 3 members', function () {
    $owner = User::factory()->withPersonalTeam('Free Cap Team')->create();
    $team = $owner->currentTeam;

    $member2 = User::factory()->create();
    $team->users()->attach($member2->id, ['role' => Role::Member->value]);

    $member3 = User::factory()->create();
    $team->users()->attach($member3->id, ['role' => Role::Member->value]);

    expect($team->users()->count())->toBe(3);

    // 1) Sending a 4th invite when 3 members exist is rejected
    $inviteResponse = $this->actingAs($owner)->post("/teams/{$team->id}/invitations", [
        'email' => 'fourth@example.com',
        'role' => Role::Member->value,
    ]);

    $inviteResponse->assertSessionHasErrors(['email']);
    expect(Invitation::where('email', 'fourth@example.com')->exists())->toBeFalse();

    // 2) Pending invites count toward the 3-member ceiling
    $secondFreeTeam = Team::factory()->create();
    $owner2 = User::factory()->create();
    $secondFreeTeam->users()->attach($owner2->id, ['role' => Role::Owner->value]);
    $owner2->switchTeam($secondFreeTeam);

    // 1 member + 2 invites = 3 seats taken
    Invitation::factory()->create(['team_id' => $secondFreeTeam->id, 'email' => 'seat2@example.com', 'accepted_at' => null]);
    Invitation::factory()->create(['team_id' => $secondFreeTeam->id, 'email' => 'seat3@example.com', 'accepted_at' => null]);

    expect($secondFreeTeam->totalMemberSeatsTaken())->toBe(3);

    $blockedInviteResponse = $this->actingAs($owner2)->post("/teams/{$secondFreeTeam->id}/invitations", [
        'email' => 'seat4@example.com',
        'role' => Role::Member->value,
    ]);
    $blockedInviteResponse->assertSessionHasErrors(['email']);

    // 3) Accepting an invite when the team already has 3 members is rejected with 403
    $orphanInvite = Invitation::factory()->create([
        'team_id' => $team->id,
        'email' => 'latecomer@example.com',
        'accepted_at' => null,
    ]);
    $lateUser = User::factory()->create(['email' => 'latecomer@example.com']);

    $acceptResponse = $this->actingAs($lateUser)->get("/invitations/{$orphanInvite->token}");
    $acceptResponse->assertStatus(403);
    expect($lateUser->fresh()->belongsToTeam($team))->toBeFalse();
});

test('a subscribed team can exceed 3 members', function () {
    $owner = User::factory()->withPersonalTeam('Pro Enterprise Team')->create();
    $team = $owner->currentTeam;

    // Attach active subscription to the team
    $team->subscriptions()->create([
        'type' => 'default',
        'stripe_id' => 'sub_test_pro_123',
        'stripe_status' => 'active',
        'stripe_price' => 'price_test_sample',
        'quantity' => 1,
        'ends_at' => null,
    ]);

    expect($team->isSubscribed())->toBeTrue();

    // Fill 3 members
    for ($i = 2; $i <= 3; $i++) {
        $m = User::factory()->create();
        $team->users()->attach($m->id, ['role' => Role::Member->value]);
    }
    expect($team->users()->count())->toBe(3);

    // Subscribed team can invite beyond 3 members
    $inviteResponse = $this->actingAs($owner)->post("/teams/{$team->id}/invitations", [
        'email' => 'member4@example.com',
        'role' => Role::Member->value,
    ]);
    $inviteResponse->assertSessionHasNoErrors();
    $inviteResponse->assertRedirect();

    $invitation = Invitation::where('email', 'member4@example.com')->first();
    expect($invitation)->not->toBeNull();

    // User can accept and join as 4th member
    $member4 = User::factory()->create(['email' => 'member4@example.com']);
    $this->actingAs($member4)->get("/invitations/{$invitation->token}")->assertRedirect(route('dashboard'));

    expect($member4->fresh()->belongsToTeam($team))->toBeTrue()
        ->and($team->fresh()->users()->count())->toBe(4);
});

test('the same webhook event processed twice has no double effect', function () {
    config(['cashier.webhook.secret' => null]);

    $team = Team::factory()->create([
        'stripe_id' => 'cus_test_team_999',
    ]);

    $eventId = 'evt_test_unique_event_12345';
    $subscriptionId = 'sub_webhook_test_1';

    $webhookPayload = [
        'id' => $eventId,
        'type' => 'customer.subscription.created',
        'data' => [
            'object' => [
                'id' => $subscriptionId,
                'customer' => 'cus_test_team_999',
                'status' => 'active',
                'metadata' => [
                    'type' => 'default',
                ],
                'items' => [
                    'data' => [
                        [
                            'id' => 'si_test_sub_item_1',
                            'price' => [
                                'id' => 'price_test_sample',
                                'product' => 'prod_test_sample',
                            ],
                            'quantity' => 1,
                        ],
                    ],
                ],
            ],
        ],
    ];

    // First webhook delivery
    $firstResponse = $this->postJson('/stripe/webhook', $webhookPayload);
    $firstResponse->assertStatus(200);

    expect(WebhookEvent::where('event_id', $eventId)->count())->toBe(1)
        ->and($team->subscriptions()->where('stripe_id', $subscriptionId)->count())->toBe(1);

    // Second webhook delivery with identical event ID
    $secondResponse = $this->postJson('/stripe/webhook', $webhookPayload);
    $secondResponse->assertStatus(200);
    expect($secondResponse->getContent())->toBe('Webhook Already Processed');

    // Verify idempotency: strictly 1 webhook_events row and 1 subscription row
    expect(WebhookEvent::where('event_id', $eventId)->count())->toBe(1)
        ->and($team->subscriptions()->where('stripe_id', $subscriptionId)->count())->toBe(1);
});

test('failed webhook processing rolls back the event ID so retry succeeds', function () {
    config(['cashier.webhook.secret' => null]);

    $team = Team::factory()->create([
        'stripe_id' => 'cus_test_team_fail_retry',
    ]);

    $eventId = 'evt_test_fail_and_retry_9999';
    $subscriptionId = 'sub_webhook_retry_test';

    $webhookPayload = [
        'id' => $eventId,
        'type' => 'customer.subscription.created',
        'data' => [
            'object' => [
                'id' => $subscriptionId,
                'customer' => 'cus_test_team_fail_retry',
                'status' => 'active',
                'metadata' => [
                    'type' => 'default',
                ],
                'items' => [
                    'data' => [
                        [
                            'id' => 'si_test_retry_item',
                            'price' => [
                                'id' => 'price_test_sample',
                                'product' => 'prod_test_sample',
                            ],
                            'quantity' => 1,
                        ],
                    ],
                ],
            ],
        ],
    ];

    $shouldFail = true;
    Event::listen(WebhookReceived::class, function () use (&$shouldFail) {
        if ($shouldFail) {
            throw new RuntimeException('Simulated processing failure');
        }
    });

    // First attempt fails during processing
    try {
        $this->withoutExceptionHandling()->postJson('/stripe/webhook', $webhookPayload);
    } catch (RuntimeException $e) {
        // Exception caught as expected
    }

    // Verify transaction rolled back: event_id was not recorded, subscription was not saved
    expect(WebhookEvent::where('event_id', $eventId)->exists())->toBeFalse()
        ->and($team->subscriptions()->where('stripe_id', $subscriptionId)->exists())->toBeFalse();

    // Now Stripe retries the webhook without failure
    $shouldFail = false;
    $retryResponse = $this->postJson('/stripe/webhook', $webhookPayload);
    $retryResponse->assertStatus(200);

    // Verify retry succeeded and is now recorded
    expect(WebhookEvent::where('event_id', $eventId)->exists())->toBeTrue()
        ->and($team->subscriptions()->where('stripe_id', $subscriptionId)->exists())->toBeTrue();
});
