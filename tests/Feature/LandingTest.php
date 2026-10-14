<?php

use App\Models\User;

test('guests can view the landing page', function () {
    $response = $this->get('/');

    $response->assertOk();
});

test('landing page redirects authenticated users to dashboard', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/');

    $response->assertRedirect('/dashboard');
});
