<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OtpController extends Controller
{
    public function show()
    {
        // Pastikan ada sesi google_register
        if (!session()->has('google_register')) {
            return redirect()->route('login')->with('error', 'Sesi tidak valid atau telah kadaluarsa.');
        }

        $email = session('google_register.email');
        $otp = session('google_otp');
        
        return Inertia::render('auth/GoogleOtp', [
            'email' => $email,
            'devOtp' => config('app.env') === 'local' ? $otp : null
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'otp' => 'required|numeric'
        ]);

        if (!session()->has('google_register') || !session()->has('google_otp')) {
            return redirect()->route('login')->with('error', 'Sesi verifikasi kadaluarsa. Silakan ulangi login dengan Google.');
        }

        // Cek masa berlaku OTP
        if (now()->greaterThan(session('google_otp_expires_at'))) {
            return back()->with('error', 'Kode OTP sudah kadaluarsa. Silakan ulangi login.');
        }

        $inputOtp = $request->input('otp');
        $sessionOtp = session('google_otp');

        if ((string)$inputOtp !== (string)$sessionOtp) {
            return back()->with('error', 'Kode OTP salah.');
        }

        // OTP Valid! Buat user
        $googleData = session('google_register');

        $newUser = User::create([
            'name' => $googleData['name'],
            'email' => $googleData['email'],
            'google_id' => $googleData['google_id'],
            'avatar' => $googleData['avatar'] ?? null,
        ]);

        $newUser->assignRole('user');

        Auth::login($newUser);

        // Clear session
        session()->forget(['google_register', 'google_otp', 'google_otp_expires_at']);

        return redirect()->route('home')->with('success', 'Berhasil mendaftar dan login!');
    }
}
