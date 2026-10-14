<?php

use App\Http\Controllers\CurrentTeamController;
use App\Http\Controllers\DemoLoginController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\TeamBillingController;
use App\Http\Controllers\TeamInvitationController;
use App\Http\Controllers\TeamInvoiceController;
use App\Http\Controllers\TeamMemberController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }

    return Inertia::render('Welcome');
})->name('home');

Route::post('/demo-login', [DemoLoginController::class, 'login'])->name('demo.login');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::put('/teams/current', [CurrentTeamController::class, 'update'])->name('teams.current.update');
    Route::get('/teams/{team}/members', [TeamMemberController::class, 'index'])->name('teams.members.index');
    Route::patch('/teams/{team}/members/{member}', [TeamMemberController::class, 'update'])->name('teams.members.update');
    Route::delete('/teams/{team}/members/{member}', [TeamMemberController::class, 'destroy'])->name('teams.members.destroy');
    Route::post('/teams/{team}/invitations', [TeamInvitationController::class, 'store'])->name('teams.invitations.store');
    Route::delete('/teams/{team}/invitations/{invitation}', [TeamInvitationController::class, 'destroy'])->name('teams.invitations.destroy');

    Route::get('/teams/{team}/billing', [TeamBillingController::class, 'index'])->name('teams.billing.index');
    Route::post('/teams/{team}/billing/subscribe', [TeamBillingController::class, 'subscribe'])->name('teams.billing.subscribe');
    Route::post('/teams/{team}/billing/portal', [TeamBillingController::class, 'portal'])->name('teams.billing.portal');
    Route::get('/teams/{team}/invoices', [TeamInvoiceController::class, 'index'])->name('teams.invoices.index');
    Route::get('/teams/{team}/invoices/{invoice}/download', [TeamInvoiceController::class, 'download'])->name('teams.invoices.download');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/invitations/{token}', [InvitationController::class, 'accept'])->name('invitations.accept');
Route::post('/invitations/{token}', [InvitationController::class, 'storeAccept'])->name('invitations.accept.post');

Route::post('/stripe/webhook', [StripeWebhookController::class, 'handleWebhook'])->name('cashier.webhook');

require __DIR__.'/auth.php';
