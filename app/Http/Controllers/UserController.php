<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = \App\Models\User::with('roles')->paginate(10);
        $roles = \Spatie\Permission\Models\Role::withCount('users')->with('permissions')->get();

        return \Inertia\Inertia::render('admin/Pengguna/Index', [
            'users' => $users,
            'roles' => $roles
        ]);
    }
}
