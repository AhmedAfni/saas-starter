<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DemoLoginController extends Controller
{
    /**
     * Authenticate as a seeded demo account based strictly on role.
     */
    public function login(Request $request): RedirectResponse
    {
        if (! config('app.demo_mode')) {
            abort(404);
        }

        $validated = $request->validate([
            'role' => ['required', 'string', 'in:owner,admin,member'],
        ]);

        $roleAccountMap = [
            'owner' => 'owner@acme.com',
            'admin' => 'admin@acme.com',
            'member' => 'member@acme.com',
        ];

        $email = $roleAccountMap[$validated['role']];

        $user = User::where('email', $email)->firstOrFail();

        Auth::login($user);

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }
}
