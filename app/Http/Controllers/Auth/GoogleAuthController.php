<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                // If user exists but doesn't have google_id yet, link it
                $updateData = [];
                if (!$user->google_id) {
                    $updateData['google_id'] = $googleUser->getId();
                }
                $updateData['avatar'] = $googleUser->getAvatar();
                $user->update($updateData);

                Auth::login($user);
            } else {
                // Create a 6-digit OTP
                $otp = rand(100000, 999999);

                // Send OTP via Email
                \Illuminate\Support\Facades\Mail::to($googleUser->getEmail())->send(new \App\Mail\OtpMail($otp));

                // Save data to session
                session([
                    'google_register' => [
                        'name' => $googleUser->getName(),
                        'email' => $googleUser->getEmail(),
                        'google_id' => $googleUser->getId(),
                        'avatar' => $googleUser->getAvatar(),
                    ],
                    'google_otp' => $otp,
                    'google_otp_expires_at' => now()->addMinutes(5)
                ]);

                // Redirect to OTP verification page
                return redirect()->route('google.otp.form');
            }

            return redirect()->route('home');

        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Terjadi kesalahan saat login menggunakan Google.');
        }
    }

    public function nativeLogin(Request $request)
    {
        $idToken = $request->input('idToken');

        if (!$idToken) {
            return back()->withErrors(['email' => 'Token Google tidak ditemukan.']);
        }

        try {
            $client = new \Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]);
            $payload = $client->verifyIdToken($idToken);

            if ($payload) {
                $email = $payload['email'];
                $googleId = $payload['sub'];
                $name = $payload['name'];
                $avatar = $payload['picture'];

                $user = User::where('email', $email)->first();

                if ($user) {
                    $updateData = [];
                    if (!$user->google_id) {
                        $updateData['google_id'] = $googleId;
                    }
                    $updateData['avatar'] = $avatar;
                    $user->update($updateData);

                    Auth::login($user);
                    
                    return redirect()->intended('/');
                } else {
                    // Jika user belum ada, kirim OTP
                    $otp = rand(100000, 999999);

                    // Send OTP via Email
                    \Illuminate\Support\Facades\Mail::to($email)->send(new \App\Mail\OtpMail($otp));

                    // Save data to session
                    session([
                        'google_register' => [
                            'name' => $name,
                            'email' => $email,
                            'google_id' => $googleId,
                            'avatar' => $avatar,
                        ],
                        'google_otp' => $otp,
                        'google_otp_expires_at' => now()->addMinutes(5)
                    ]);

                    // Redirect to OTP verification page
                    return redirect()->route('google.otp.form');
                }
            } else {
                return back()->withErrors(['email' => 'Token Google tidak valid']);
            }
        } catch (\Exception $e) {
            return back()->withErrors(['email' => 'Gagal memverifikasi token: ' . $e->getMessage()]);
        }
    }
}
