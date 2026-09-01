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
                
                // Secara default assign role 'user'
                $user->assignRole('user');

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
        $accessToken = $request->input('accessToken');

        if (!$idToken && !$accessToken) {
            return response()->json(['error' => 'Token tidak ditemukan (idToken dan accessToken kosong)'], 400);
        }

        try {
            $payload = null;
            $tokenSource = '';

            // 1. Coba verifikasi id_token
            if ($idToken) {
                $response = \Illuminate\Support\Facades\Http::get('https://oauth2.googleapis.com/tokeninfo', [
                    'id_token' => $idToken
                ]);
                if ($response->successful()) {
                    $payload = $response->json();
                    $tokenSource = 'id_token';
                }
            }

            // 2. Jika id_token gagal/kosong, coba verifikasi access_token
            if (!$payload && $accessToken) {
                $response2 = \Illuminate\Support\Facades\Http::get('https://oauth2.googleapis.com/tokeninfo', [
                    'access_token' => $accessToken
                ]);
                if ($response2->successful()) {
                    $payload = $response2->json();
                    $tokenSource = 'access_token';
                }
            }

            if ($payload) {
                
                // Pastikan token diperuntukkan untuk aplikasi kita (Web atau Android)
                $aud = $payload['aud'] ?? '';
                $validAudiences = [
                    env('GOOGLE_CLIENT_ID'),
                    env('GOOGLE_ANDROID_CLIENT_ID')
                ];

                if (!in_array($aud, $validAudiences)) {
                    // Hanya sekadar warning, tetap kita teruskan jika email terverifikasi (opsional)
                    \Illuminate\Support\Facades\Log::warning('Google Auth: Audience mismatch', ['aud' => $aud]);
                }
                $email = $payload['email'] ?? null;
                $googleId = $payload['sub'] ?? $payload['user_id'] ?? null;
                $name = $payload['name'] ?? 'User'; // nama mungkin tidak ada di tokeninfo access_token
                $avatar = $payload['picture'] ?? null;

                if (!$email) {
                    return response()->json(['error' => 'Email tidak ditemukan di token'], 401);
                }

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
                    
                    // Secara default assign role 'user'
                    $user->assignRole('user');

                    Auth::login($user);

                    return response()->json([
                        'message' => 'Registrasi berhasil',
                        'redirect' => '/'
                    ]);
                }
            } else {
                return response()->json([
                    'error' => 'Token Google tidak valid',
                    'google_response' => $response->json(),
                    'id_token_prefix' => substr($idToken, 0, 15) . '...'
                ], 401);
            }
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Server Error: ' . $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }
}
