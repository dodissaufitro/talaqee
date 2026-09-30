<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class PasswordController extends Controller
{
    /**
     * Show the user's password settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/password', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Show Keamanan Akun page.
     */
    public function editKeamanan(Request $request): Response
    {
        $user = $request->user();
        $hasPassword = !empty($user->password);
        $isGoogleAccount = !empty($user->google_id);

        return Inertia::render('Akun/Keamanan', [
            'hasPassword' => $hasPassword,
            'isGoogleAccount' => $isGoogleAccount,
            'email' => $user->email,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update password from Keamanan Akun page.
     */
    public function updateKeamanan(Request $request): RedirectResponse
    {
        $user = $request->user();
        $rules = [
            'password' => ['required', Password::min(8), 'confirmed'],
        ];

        if (!empty($user->password)) {
            $rules['current_password'] = ['required', 'current_password'];
        }

        $validated = $request->validate($rules);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Kata sandi berhasil diperbarui.');
    }
}
