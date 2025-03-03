<?php

namespace App\Http\Controllers;

use App\Models\RealIp;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RealIpController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $realIps = RealIp::latest()->paginate(10);
        
        return Inertia::render('RealIp/Index', [
            'realIps' => $realIps
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ip_address' => 'required|ip|unique:real_ips,ip_address',
            'customer_cost' => 'required|numeric|min:0',
            'reseller_cost' => 'required|numeric|min:0',
            'is_used' => 'boolean',
        ]);

        RealIp::create($validated);

        return redirect()->back()->with('success', 'Real IP created successfully');
    }

    public function update(Request $request, RealIp $realIp)
    {
        $validated = $request->validate([
            'ip_address' => 'required|ip|unique:real_ips,ip_address,' . $realIp->id,
            'customer_cost' => 'required|numeric|min:0',
            'reseller_cost' => 'required|numeric|min:0',
            'is_used' => 'boolean',
        ]);

        $realIp->update($validated);

        return redirect()->back()->with('success', 'Real IP updated successfully');
    }

    public function destroy(RealIp $realIp)
    {
        $realIp->delete();
        return redirect()->back()->with('success', 'Real IP deleted successfully');
    }
} 