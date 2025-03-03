<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = [
            'website_name' => Setting::get('website_name', 'My Application'),
            'currency' => Setting::get('currency', 'USD'),
            'company_name' => Setting::get('company_name'),
            'company_email' => Setting::get('company_email'),
            'company_phone' => Setting::get('company_phone'),
            'company_address' => Setting::get('company_address'),
        ];

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'website_name' => 'required|string|max:255',
            'currency' => 'required|string|size:3',
            'company_name' => 'required|string|max:255',
            'company_email' => 'required|email',
            'company_phone' => 'required|string|max:20',
            'company_address' => 'required|string',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value);
        }

        return redirect()->back()->with('success', 'Settings updated successfully');
    }
} 