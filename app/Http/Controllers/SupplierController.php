<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $suppliers = Supplier::latest()->paginate(10);
        
        return Inertia::render('Supplier/Index', [
            'suppliers' => $suppliers
        ]);
    }

    public function create()
    {
        return Inertia::render('Supplier/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'address' => 'required|string',
            'credit_balance' => 'numeric|min:0',
            'debit_balance' => 'numeric|min:0',
        ]);

        // Calculate initial balance
        $validated['balance'] = ($validated['credit_balance'] ?? 0) - ($validated['debit_balance'] ?? 0);

        Supplier::create($validated);

        return redirect()->route('admin.suppliers.index')
            ->with('success', 'Supplier created successfully');
    }

    public function edit(Supplier $supplier)
    {
        return Inertia::render('Supplier/Edit', [
            'supplier' => $supplier
        ]);
    }

    public function update(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'address' => 'required|string',
            'credit_balance' => 'numeric|min:0',
            'debit_balance' => 'numeric|min:0',
            'status' => 'required|in:active,inactive',
        ]);

        // Calculate balance
        $validated['balance'] = $validated['credit_balance'] - $validated['debit_balance'];

        $supplier->update($validated);

        return redirect()->route('admin.suppliers.index')
            ->with('success', 'Supplier updated successfully');
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return redirect()->route('admin.suppliers.index')
            ->with('success', 'Supplier deleted successfully');
    }

    public function show(Supplier $supplier)
    {
        return Inertia::render('Supplier/Show', [
            'supplier' => $supplier
        ]);
    }

    public function updateBalance(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            'credit_amount' => 'numeric|min:0',
            'debit_amount' => 'numeric|min:0',
        ]);

        $supplier->updateBalances(
            $validated['credit_amount'] ?? 0,
            $validated['debit_amount'] ?? 0
        );

        return redirect()->back()->with('success', 'Supplier balance updated successfully');
    }
}
