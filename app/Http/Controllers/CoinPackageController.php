<?php

namespace App\Http\Controllers;

use App\Models\CoinPackage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CoinPackageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $packages = CoinPackage::orderBy('coin_amount', 'asc')->get();

        return Inertia::render('admin/CoinPackages/Index', [
            'packages' => $packages,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'coin_amount' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'bonus_coin' => 'nullable|integer|min:0',
            'is_popular' => 'nullable|boolean',
            'badge_label' => 'nullable|string|max:50',
            'badge_color' => 'nullable|string|max:30',
            'is_active' => 'nullable|boolean',
        ]);

        $validated['bonus_coin'] = $validated['bonus_coin'] ?? 0;
        $validated['is_popular'] = $request->boolean('is_popular');
        $validated['is_active'] = $request->has('is_active') ? $request->boolean('is_active') : true;

        CoinPackage::create($validated);

        return redirect()->back()->with('success', 'Paket koin berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CoinPackage $coinPackage)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'coin_amount' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'bonus_coin' => 'nullable|integer|min:0',
            'is_popular' => 'nullable|boolean',
            'badge_label' => 'nullable|string|max:50',
            'badge_color' => 'nullable|string|max:30',
            'is_active' => 'nullable|boolean',
        ]);

        $validated['bonus_coin'] = $validated['bonus_coin'] ?? 0;
        $validated['is_popular'] = $request->boolean('is_popular');
        $validated['is_active'] = $request->boolean('is_active');

        $coinPackage->update($validated);

        return redirect()->back()->with('success', 'Paket koin berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CoinPackage $coinPackage)
    {
        $coinPackage->delete();

        return redirect()->back()->with('success', 'Paket koin berhasil dihapus.');
    }
}
