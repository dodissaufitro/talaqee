<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('roles');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role')) {
            $role = $request->role;
            $query->whereHas('roles', function ($q) use ($role) {
                $q->where('name', $role);
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $users = $query->orderBy('id', 'desc')->paginate(10)->withQueryString();
        $roles = Role::withCount('users')->with('permissions')->get();

        return Inertia::render('admin/Pengguna/Index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => [
                'search' => $request->search ?? '',
                'role' => $request->role ?? '',
                'status' => $request->status ?? '',
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:25',
            'city' => 'nullable|string|max:100',
            'status' => 'nullable|string|max:50',
            'coin_balance' => 'nullable|integer|min:0',
            'role' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'city' => $validated['city'] ?? null,
            'status' => $validated['status'] ?? 'Aktif',
            'coin_balance' => $validated['coin_balance'] ?? 0,
        ]);

        if (!empty($validated['role']) && Role::where('name', $validated['role'])->exists()) {
            $user->assignRole($validated['role']);
        }

        return redirect()->back()->with('success', "Pengguna {$user->name} berhasil ditambahkan.");
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
            'phone' => 'nullable|string|max:25',
            'city' => 'nullable|string|max:100',
            'status' => 'nullable|string|max:50',
            'coin_balance' => 'required|integer|min:0',
            'role' => 'nullable|string',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'city' => $validated['city'] ?? null,
            'status' => $validated['status'] ?? $user->status,
            'coin_balance' => (int) $validated['coin_balance'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        if (!empty($validated['role'])) {
            if (Role::where('name', $validated['role'])->exists()) {
                $user->syncRoles([$validated['role']]);
            }
        }

        return redirect()->back()->with('success', "Data pengguna {$user->name} berhasil diperbarui.");
    }

    public function destroy(User $user)
    {
        if (auth()->id() === $user->id) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $userName = $user->name;
        $user->delete();

        return redirect()->back()->with('success', "Pengguna {$userName} berhasil dihapus.");
    }
}

