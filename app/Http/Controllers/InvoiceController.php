<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Customer;
use App\Models\Package;
use App\Models\Service;
use App\Models\Account;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $invoices = Invoice::with(['customer'])
            ->latest()
            ->paginate(10);
        
        return Inertia::render('Invoice/Index', [
            'invoices' => $invoices
        ]);
    }

    public function create()
    {
        return Inertia::render('Invoice/Create', [
            'customers' => Customer::select('id', 'first_name', 'last_name', 'email')
                ->get()
                ->map(function ($customer) {
                    return [
                        'id' => $customer->id,
                        'name' => $customer->first_name . ' ' . $customer->last_name,
                        'email' => $customer->email
                    ];
                }),
            'products' => Product::with('inventory')
                ->where('status', 'active')
                ->get()
                ->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'type' => 'product',
                        'name' => $product->name,
                        'code' => $product->code,
                        'selling_price' => $product->selling_price,
                        'unit' => $product->unit,
                        'available_quantity' => $product->inventory->available_quantity ?? 0
                    ];
                }),
            'packages' => Package::all()
                ->map(function ($package) {
                    return [
                        'id' => $package->id,
                        'type' => 'package',
                        'name' => $package->name,
                        'selling_price' => $package->package_cost,
                        'subscription_type' => $package->subscription_type
                    ];
                }),
            'services' => Service::where('status', 'active')
                ->get()
                ->map(function ($service) {
                    return [
                        'id' => $service->id,
                        'type' => 'service',
                        'name' => $service->name,
                        'selling_price' => $service->price
                    ];
                }),
            'nextInvoiceNumber' => $this->generateInvoiceNumber()
        ]);
    }

    private function generateInvoiceNumber()
    {
        $prefix = 'INV-';
        $year = date('Y');
        $month = date('m');
        
        $lastInvoice = Invoice::where('invoice_number', 'like', "{$prefix}{$year}{$month}%")
            ->orderBy('invoice_number', 'desc')
            ->first();

        if ($lastInvoice) {
            $sequence = intval(substr($lastInvoice->invoice_number, -4)) + 1;
        } else {
            $sequence = 1;
        }

        return $prefix . $year . $month . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.type' => 'required|in:product,package,service',
            'items.*.item_id' => 'required',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.tax' => 'nullable|numeric|min:0',
            'items.*.discount' => 'required|numeric|min:0'
        ]);

        DB::beginTransaction();
        try {
            // Calculate totals
            $subtotal = collect($validated['items'])->sum(function ($item) {
                return $item['quantity'] * $item['unit_price'];
            });

            $tax = collect($validated['items'])->sum(function ($item) {
                return ($item['quantity'] * $item['unit_price']) * ($item['tax'] / 100);
            });

            $total = $subtotal + $tax;

            // Create invoice
            $invoice = Invoice::create([
                'invoice_number' => $this->generateInvoiceNumber(),
                'customer_id' => $validated['customer_id'],
                'issue_date' => $validated['issue_date'],
                'due_date' => $validated['due_date'],
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'amount_paid' => 0,
                'balance_due' => $total,
                'status' => Invoice::STATUS_DRAFT,
                'notes' => $validated['notes'] ?? null,
            ]);

            // Create invoice items
            foreach ($validated['items'] as $item) {
                $itemSubtotal = $item['quantity'] * $item['unit_price'];
                $itemTax = $itemSubtotal * ($item['tax'] / 100);
                $itemTotal = $itemSubtotal + $itemTax;

                $invoice->items()->create([
                    'item_type' => $item['type'],
                    'item_id' => $item['item_id'],
                    'description' => $item['description'] ?? $this->getItemDescription($item),
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $itemSubtotal,
                    'tax' => $itemTax,
                    'total' => $itemTotal
                ]);
            }

            DB::commit();
            return redirect()->route('admin.invoices.show', $invoice)
                ->with('success', 'Invoice created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to create invoice: ' . $e->getMessage());
        }
    }

    public function show(Invoice $invoice)
    {
        $invoice->load([
            'customer',
            'items' => function ($query) {
                $query->with(['itemDetails']);
            },
            'payments'
        ]);
        
        // Transform items to include detailed information
        $invoice->items->transform(function ($item) {
            $itemDetails = $item->itemDetails;
            return [
                'id' => $item->id,
                'type' => $item->item_type,
                'name' => $itemDetails->name ?? '',
                'description' => $item->description,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'subtotal' => $item->subtotal,
                'tax' => $item->tax,
                'discount' => $item->discount,
                'total' => $item->total,
                // Additional details based on type
                'details' => match($item->item_type) {
                    'package' => [
                        'subscription_type' => $itemDetails->subscription_type ?? null,
                    ],
                    'product' => [
                        'code' => $itemDetails->code ?? null,
                        'unit' => $itemDetails->unit ?? null,
                    ],
                    'service' => [
                        'duration' => $itemDetails->duration ?? null,
                    ],
                    default => [],
                }
            ];
        });
        
        return Inertia::render('Invoice/Show', [
            'invoice' => $invoice,
            'payments' => $invoice->payments()->with('account')->latest()->get(),
            'accounts' => Account::where('is_active', true)->get(),
        ]);
    }

    public function edit(Invoice $invoice)
    {
        if ($invoice->status !== 'draft') {
            return redirect()->back()
                ->with('error', 'Only draft invoices can be edited');
        }

        $invoice->load(['customer', 'items']);

        return Inertia::render('Invoice/Edit', [
            'invoice' => $invoice,
            'customers' => Customer::select('id', 'first_name', 'last_name')->get(),
            'products' => Product::with('inventory')
                ->where('status', 'active')
                ->get()
                ->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'type' => 'product',
                        'name' => $product->name,
                        'code' => $product->code,
                        'selling_price' => $product->selling_price,
                        'unit' => $product->unit,
                        'available_quantity' => $product->inventory->available_quantity ?? 0
                    ];
                }),
            'packages' => Package::select('id', 'name', 'subscription_type', 'package_cost')
                ->get()
                ->map(function ($package) {
                    return [
                        'id' => $package->id,
                        'type' => 'package',
                        'name' => $package->name,
                        'subscription_type' => $package->subscription_type,
                        'selling_price' => $package->package_cost
                    ];
                }),
            'services' => Service::select('id', 'name', 'price')
                ->where('status', 'active')
                ->get()
                ->map(function ($service) {
                    return [
                        'id' => $service->id,
                        'type' => 'service',
                        'name' => $service->name,
                        'selling_price' => $service->price
                    ];
                })
        ]);
    }

    public function update(Request $request, Invoice $invoice)
    {
        if ($invoice->status !== 'draft') {
            return redirect()->back()
                ->with('error', 'Only draft invoices can be edited');
        }

        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'items' => 'required|array|min:1',
            'items.*.type' => 'required|in:product,package,service',
            'items.*.item_id' => 'required',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.tax' => 'required|numeric|min:0',
            'items.*.discount' => 'required|numeric|min:0',
            'tax' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            // Calculate totals
            $subtotal = collect($validated['items'])->sum(function ($item) {
                return $item['quantity'] * $item['unit_price'];
            });

            $total = $subtotal + $validated['tax'];

            // Update invoice
            $invoice->update([
                'customer_id' => $validated['customer_id'],
                'issue_date' => $validated['issue_date'],
                'due_date' => $validated['due_date'],
                'subtotal' => $subtotal,
                'tax' => $validated['tax'],
                'total' => $total,
                'balance_due' => $total - $invoice->amount_paid,
                'notes' => $validated['notes'],
            ]);

            // Delete existing items
            $invoice->items()->delete();

            // Create new items
            foreach ($validated['items'] as $item) {
                $invoice->items()->create([
                    'item_type' => $item['type'],
                    'item_id' => $item['item_id'],
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'tax' => $item['tax'],
                    'discount' => $item['discount']
                ]);
            }

            DB::commit();
            return redirect()->route('admin.invoices.show', $invoice)
                ->with('success', 'Invoice updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to update invoice: ' . $e->getMessage());
        }
    }

    public function destroy(Invoice $invoice)
    {
        if ($invoice->status !== 'draft') {
            return redirect()->back()
                ->with('error', 'Only draft invoices can be deleted');
        }

        $invoice->items()->delete();
        $invoice->delete();

        return redirect()->route('admin.invoices.index')
            ->with('success', 'Invoice deleted successfully');
    }


    public function send(Invoice $invoice)
    {
        if ($invoice->status === Invoice::STATUS_DRAFT) {
            $invoice->update(['status' => Invoice::STATUS_SENT]);
            // Here you could also add email sending logic
            return redirect()->back()->with('success', 'Invoice has been marked as sent.');
        }
        
        return redirect()->back()->with('error', 'Only draft invoices can be sent.');
    }

    public function markAsPaid(Invoice $invoice)
    {
        if ($invoice->balance_due <= 0) {
            $invoice->update(['status' => Invoice::STATUS_PAID]);
            return redirect()->back()->with('success', 'Invoice has been marked as paid.');
        }
        
        return redirect()->back()->with('error', 'Invoice has remaining balance.');
    }

    public function cancel(Invoice $invoice)
    {
        if (!in_array($invoice->status, [Invoice::STATUS_PAID, Invoice::STATUS_CANCELLED])) {
            $invoice->update(['status' => Invoice::STATUS_CANCELLED]);
            return redirect()->back()->with('success', 'Invoice has been cancelled.');
        }
        
        return redirect()->back()->with('error', 'This invoice cannot be cancelled.');
    }

    private function getItemDescription($item): string
    {
        switch ($item['type']) {
            case 'product':
                $product = Product::find($item['item_id']);
                return $product ? $product->name : '';
            case 'package':
                $package = Package::find($item['item_id']);
                return $package ? $package->name : '';
            case 'service':
                $service = Service::find($item['item_id']);
                return $service ? $service->name : '';
            default:
                return '';
        }
    }

} 