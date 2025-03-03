<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $packages = Package::latest()->paginate(10);
        
        return Inertia::render('Package/Index', [
            'packages' => $packages
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'ip_pool_name' => 'required|string|max:255',
            'subscription_type' => 'required|in:daily,weekly,monthly,yearly',
            'package_cost' => 'required|numeric|min:0',
            'reseller_package_cost' => 'required|numeric|min:0',
        ]);

        Package::create($validated);

        return redirect()->back()->with('success', 'Package created successfully');
    }

    public function update(Request $request, Package $package)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'ip_pool_name' => 'required|string|max:255',
            'subscription_type' => 'required|in:daily,weekly,monthly,yearly',
            'package_cost' => 'required|numeric|min:0',
            'reseller_package_cost' => 'required|numeric|min:0',
        ]);

        $package->update($validated);

        return redirect()->back()->with('success', 'Package updated successfully');
    }

    public function destroy(Package $package)
    {
        $package->delete();
        return redirect()->back()->with('success', 'Package deleted successfully');
    }
} 