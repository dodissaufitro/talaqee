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
                // Jika user belum ada, daftarkan dan auto-login (bypass OTP)
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'password' => bcrypt(\Illuminate\Support\Str::random(16))
                ]);
                
                // Secara default assign role 'customer'
                $user->assignRole('customer');

                Auth::login($user);
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
            return response()->json(['error' => 'idToken tidak ditemukan'], 400);
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

                    return response()->json([
                        'message' => 'Login berhasil',
                        'redirect' => '/'
                    ]);
                } else {
                    // Jika user belum ada, daftarkan dan auto-login (bypass OTP)
                    $user = User::create([
                        'name' => $name,
                        'email' => $email,
                        'google_id' => $googleId,
                        'avatar' => $avatar,
                        'password' => bcrypt(\Illuminate\Support\Str::random(16))
                    ]);
                    
                    // Secara default assign role 'customer'
                    $user->assignRole('customer');

                    Auth::login($user);

                    return response()->json([
                        'message' => 'Registrasi berhasil',
                        'redirect' => '/'
                    ]);
                }
            } else {
                return response()->json(['error' => 'Token Google tidak valid'], 401);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal memverifikasi token: ' . $e->getMessage()], 500);
        }
    }
}
