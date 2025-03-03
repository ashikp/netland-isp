<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Nas;
use App\Models\RealIp;
use App\Models\Package;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:web');
    }

    public function index()
    {
        if (!Auth::guard('web')->check()) {
            return redirect()->route('admin.login');
        }

        $stats = [
            'total_customers' => Customer::count(),
            'active_nas' => Nas::count(),
            'available_ips' => RealIp::where('is_used', false)->count(),
            'total_packages' => Package::count(),
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats
        ]);
    }
} 