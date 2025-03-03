<?php

namespace App\Http\Controllers;

use App\Models\Nas;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class NasController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $nas = Nas::latest()->paginate(10);
        
        return Inertia::render('Nas/Index', [
            'nas' => $nas
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'ip_address' => 'required|ip',
            'router_type' => 'required|string|max:255',
            'secret_key' => 'required|string|max:255',
        ]);

        Nas::create($validated);

        return redirect()->back()->with('success', 'NAS created successfully');
    }

    public function update(Request $request, $id)
    {
        try {
            $nas = Nas::findOrFail($id);
            
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'ip_address' => 'required|ip',
                'router_type' => 'required|string|max:255',
                'secret_key' => 'required|string|max:255',
            ]);

            Log::info('Updating NAS:', [
                'id' => $id,
                'request_data' => $request->all(),
                'old_data' => $nas->toArray(),
                'new_data' => $validated
            ]);

            $nas->update($validated);
            
            return redirect()->back()->with('success', 'NAS updated successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'NAS not found');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update NAS');
        }
    }

    public function destroy($id)
    {
        try {
            $nas = Nas::findOrFail($id);
            $nas->delete();
            return redirect()->back()->with('success', 'NAS deleted successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'NAS not found');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete NAS');
        }
    }
} 