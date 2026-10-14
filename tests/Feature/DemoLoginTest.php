<?php

use App\Models\User;

test('demo login returns 404 when demo mode is disabled', function () {
    config(['app.demo_mode' => false]);

    $response = $this->post('/demo-login', [
        'role' => 'owner',
    ]);

    $response->assertNotFound();
    $this->assertGuest();
});

test('demo login works when enabled and authenticates owner', function () {
    config(['app.demo_mode' => true]);

    User::firstOrCreate(
        ['email' => 'owner@acme.com'],
        ['name' => 'Alice Owner', 'password' => 'password']
    );

    $response = $this->post('/demo-login', [
        'role' => 'owner',
    ]);

    $response->assertRedirect('/dashboard');
    $this->assertAuthenticated();
    $this->assertSame('owner@acme.com', auth()->user()->email);
});

test('demo login works when enabled and authenticates admin', function () {
    config(['app.demo_mode' => true]);

    User::firstOrCreate(
        ['email' => 'admin@acme.com'],
        ['name' => 'Bob Admin', 'password' => 'password']
    );

    $response = $this->post('/demo-login', [
        'role' => 'admin',
    ]);

    $response->assertRedirect('/dashboard');
    $this->assertAuthenticated();
    $this->assertSame('admin@acme.com', auth()->user()->email);
});

test('demo login works when enabled and authenticates member', function () {
    config(['app.demo_mode' => true]);

    User::firstOrCreate(
        ['email' => 'member@acme.com'],
        ['name' => 'Charlie Member', 'password' => 'password']
    );

    $response = $this->post('/demo-login', [
        'role' => 'member',
    ]);

    $response->assertRedirect('/dashboard');
    $this->assertAuthenticated();
    $this->assertSame('member@acme.com', auth()->user()->email);
});

test('demo login rejects invalid roles', function () {
    config(['app.demo_mode' => true]);

    $response = $this->post('/demo-login', [
        'role' => 'invalid_role',
    ]);

    $response->assertSessionHasErrors('role');
    $this->assertGuest();
});

test('landing page redirects authenticated users to dashboard', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/');

    $response->assertRedirect('/dashboard');
});
