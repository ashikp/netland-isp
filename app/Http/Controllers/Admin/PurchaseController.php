<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use App\Models\Supplier;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Account;

class PurchaseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $purchases = Purchase::with('supplier')
            ->latest()
            ->paginate(10);

        return Inertia::render('Purchase/Index', [
            'purchases' => $purchases
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Purchase/Create', [
            'suppliers' => Supplier::select('id', 'name')->get(),
            'products' => Product::with(['inventory' => function($query) {
                $query->select('product_id', 'available_quantity');
            }])->select('id', 'name', 'purchase_price')->get(),
            'nextPurchaseNumber' => $this->generatePurchaseNumber()
        ]);
    }

    private function generatePurchaseNumber()
    {
        $latestPurchase = Purchase::latest()->first();
        return $latestPurchase 
            ? 'PUR-' . str_pad((intval(substr($latestPurchase->invoice_number, 4)) + 1), 6, '0', STR_PAD_LEFT)
            : 'PUR-000001';
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'purchase_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:purchase_date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'tax' => 'required|numeric|min:0',
            'discount' => 'required|numeric|min:0',
            'notes' => 'nullable|string'
        ]);

        DB::beginTransaction();
        try {
            // Calculate totals
            $subtotal = collect($validated['items'])->sum(function ($item) {
                return $item['quantity'] * $item['unit_price'];
            });

            $taxAmount = ($subtotal * $validated['tax']) / 100;
            $total = $subtotal + $taxAmount - $validated['discount'];

            // Create purchase
            $purchase = Purchase::create([
                'invoice_number' => $this->generatePurchaseNumber(),
                'supplier_id' => $validated['supplier_id'],
                'purchase_date' => $validated['purchase_date'],
                'due_date' => $validated['due_date'],
                'subtotal' => $subtotal,
                'tax' => $taxAmount,
                'discount' => $validated['discount'],
                'total' => $total,
                'paid_amount' => 0,
                'due_amount' => $total,
                'payment_status' => 'unpaid',
                'status' => 'pending',
                'notes' => $validated['notes'] ?? null,
            ]);

            // Create purchase items and update inventory
            foreach ($validated['items'] as $item) {
                $itemSubtotal = $item['quantity'] * $item['unit_price'];
                $itemTax = ($itemSubtotal * $validated['tax']) / 100;
                $itemTotal = $itemSubtotal + $itemTax;

                // Create purchase item
                $purchase->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $itemSubtotal,
                    'tax' => $itemTax,
                    'total' => $itemTotal
                ]);

                // Update product inventory
                $product = Product::findOrFail($item['product_id']);
                $product->inventory()->increment('quantity', $item['quantity']);
                $product->inventory()->increment('available_quantity', $item['quantity']);

                // Update product purchase price
                $product->update([
                    'purchase_price' => $item['unit_price']
                ]);
            }

            DB::commit();
            return redirect()->route('admin.purchases.show', $purchase)
                ->with('success', 'Purchase created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to create purchase: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Purchase $purchase)
    {
        return Inertia::render('Purchase/Show', [
            'purchase' => $purchase->load(['supplier', 'items.product']),
            'accounts' => Account::where('is_active', true)
                ->select('id', 'name', 'balance')
                ->get()
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Purchase $purchase)
    {
        return Inertia::render('Purchase/Edit', [
            'purchase' => $purchase->load(['supplier', 'items.product'])
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Purchase $purchase)
    {
        // Implementation coming soon
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Purchase $purchase)
    {
        $purchase->delete();
        return redirect()->route('admin.purchases.index');
    }

    public function invoice(Purchase $purchase)
    {
        return Inertia::render('Purchase/Invoice', [
            'purchase' => $purchase->load(['supplier', 'items.product'])
        ]);
    }
}
