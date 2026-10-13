<?php

use App\Enums\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Stripe\Invoice as StripeInvoice;
use Stripe\Service\InvoiceService;
use Stripe\StripeClient;

test('a non-owner cannot open the invoices page', function () {
    $owner = User::factory()->withPersonalTeam('Alpha Team')->create();
    $team = $owner->currentTeam;

    $admin = User::factory()->create();
    $team->users()->attach($admin->id, ['role' => Role::Admin->value]);

    $member = User::factory()->create();
    $team->users()->attach($member->id, ['role' => Role::Member->value]);

    // Admin is unauthorized
    $this->actingAs($admin)->get("/teams/{$team->id}/invoices")->assertStatus(403);

    // Member is unauthorized
    $this->actingAs($member)->get("/teams/{$team->id}/invoices")->assertStatus(403);
});

test('an owner of team A cannot open team B invoices', function () {
    $ownerA = User::factory()->withPersonalTeam('Team A')->create();
    $teamA = $ownerA->currentTeam;

    $ownerB = User::factory()->withPersonalTeam('Team B')->create();
    $teamB = $ownerB->currentTeam;

    // Owner of Team A cannot view Team B's invoices
    $this->actingAs($ownerA)->get("/teams/{$teamB->id}/invoices")->assertStatus(403);

    // Owner of Team A cannot download Team B's invoice
    $this->actingAs($ownerA)->get("/teams/{$teamB->id}/invoices/in_fake_123/download")->assertStatus(403);
});

test('an owner sees empty invoices state when team has no invoices', function () {
    $owner = User::factory()->withPersonalTeam('Empty Invoices Team')->create();
    $team = $owner->currentTeam;

    $response = $this->actingAs($owner)->get("/teams/{$team->id}/invoices");

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Teams/Invoices')
        ->where('team.id', $team->id)
        ->has('invoices', 0)
    );
});

test('an owner can view list of invoices and download link when invoices exist', function () {
    $owner = User::factory()->withPersonalTeam('Paying Team')->create();
    $team = $owner->currentTeam;
    $team->update(['stripe_id' => 'cus_test_paying_team']);

    $stripeInvoice = StripeInvoice::constructFrom([
        'id' => 'in_test_invoice_100',
        'customer' => 'cus_test_paying_team',
        'created' => 1700000000,
        'total' => 2900,
        'currency' => 'usd',
        'status' => 'paid',
        'invoice_pdf' => 'https://pay.stripe.com/invoice/in_test_invoice_100/pdf',
        'hosted_invoice_url' => 'https://invoice.stripe.com/i/acct_123/test',
        'amount_due' => 2900,
        'starting_balance' => 0,
        'subtotal' => 2900,
    ]);

    $stripeClient = Mockery::mock(StripeClient::class);
    $invoiceService = Mockery::mock(InvoiceService::class);
    $stripeClient->invoices = $invoiceService;

    $invoiceCollection = (object) [
        'data' => [$stripeInvoice],
    ];

    $invoiceService->shouldReceive('all')
        ->with(Mockery::on(function ($params) {
            return ($params['customer'] ?? null) === 'cus_test_paying_team';
        }))
        ->andReturn($invoiceCollection);

    $this->app->bind(StripeClient::class, fn () => $stripeClient);

    $response = $this->actingAs($owner)->get("/teams/{$team->id}/invoices");

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Teams/Invoices')
        ->where('team.id', $team->id)
        ->has('invoices', 1)
        ->where('invoices.0.id', 'in_test_invoice_100')
        ->where('invoices.0.status', 'paid')
        ->where('invoices.0.pdf_url', 'https://pay.stripe.com/invoice/in_test_invoice_100/pdf')
    );
});

test('an owner can download hosted invoice pdf via redirect', function () {
    $owner = User::factory()->withPersonalTeam('Download Team')->create();
    $team = $owner->currentTeam;
    $team->update(['stripe_id' => 'cus_test_download_team']);

    $stripeInvoice = StripeInvoice::constructFrom([
        'id' => 'in_test_invoice_download',
        'customer' => 'cus_test_download_team',
        'created' => 1700000000,
        'total' => 2900,
        'currency' => 'usd',
        'status' => 'paid',
        'invoice_pdf' => 'https://pay.stripe.com/invoice/in_test_invoice_download/pdf',
        'hosted_invoice_url' => 'https://invoice.stripe.com/i/acct_123/download_test',
        'amount_due' => 2900,
        'starting_balance' => 0,
        'subtotal' => 2900,
    ]);

    $stripeClient = Mockery::mock(StripeClient::class);
    $invoiceService = Mockery::mock(InvoiceService::class);
    $stripeClient->invoices = $invoiceService;

    $invoiceService->shouldReceive('retrieve')
        ->with('in_test_invoice_download')
        ->andReturn($stripeInvoice);

    $this->app->bind(StripeClient::class, fn () => $stripeClient);

    $response = $this->actingAs($owner)->get("/teams/{$team->id}/invoices/in_test_invoice_download/download");

    $response->assertRedirect('https://pay.stripe.com/invoice/in_test_invoice_download/pdf');
});
