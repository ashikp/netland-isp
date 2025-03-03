<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Invoice;
use App\Models\Customer;
use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class PaymentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        return Inertia::render('Payment/Index', [
            'payments' => Payment::with(['customer', 'supplier', 'invoice', 'purchase', 'account'])
                ->latest()
                ->paginate(10),
            'customers' => Customer::select('id', 'first_name', 'last_name', 'username')
                ->orderBy('first_name')
                ->get()
                ->map(function ($customer) {
                    return [
                        'id' => $customer->id,
                        'name' => $customer->full_name,
                        'username' => $customer->username
                    ];
                }),
            'invoices' => Invoice::with('customer')
                ->whereIn('status', ['sent', 'partially_paid'])
                ->where('balance_due', '>', 0)
                ->select('id', 'invoice_number', 'customer_id', 'total', 'balance_due')
                ->get(),
            'accounts' => Account::where('is_active', true)
                ->select('id', 'name')
                ->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Payment/Create', [
            'customers' => Customer::select('id', 'first_name', 'last_name', 'balance')->get(),
            'invoices' => Invoice::whereIn('status', ['sent', 'partially_paid', 'overdue'])
                ->with('customer')
                ->get(),
            'accounts' => Account::where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'customer_id' => 'required|exists:customers,id',
                'invoice_id' => 'required|exists:invoices,id',
                'account_id' => 'required|exists:accounts,id',
                'amount' => [
                    'required',
                    'numeric',
                    'min:0.01',
                    Rule::exists('invoices', 'balance_due')
                        ->where(function ($query) use ($request) {
                            $query->where('id', $request->invoice_id)
                                  ->where('balance_due', '>=', $request->amount);
                        }),
                ],
                'payment_date' => 'required|date',
                'payment_method' => 'required|in:cash,bank_transfer,mobile_banking',
                'reference_number' => 'nullable|string|max:255',
                'notes' => 'nullable|string',
            ]);

            DB::beginTransaction();

            // Generate payment number
            $latestPayment = Payment::latest()->first();
            $nextPaymentNumber = $latestPayment 
                ? 'PAY-' . str_pad((intval(substr($latestPayment->payment_number, 4)) + 1), 6, '0', STR_PAD_LEFT)
                : 'PAY-000001';

            // Create payment
            $payment = Payment::create([
                'payment_number' => $nextPaymentNumber,
                'customer_id' => $validated['customer_id'],
                'invoice_id' => $validated['invoice_id'],
                'account_id' => $validated['account_id'],
                'amount' => $validated['amount'],
                'payment_date' => $validated['payment_date'],
                'payment_method' => $validated['payment_method'],
                'reference_number' => $validated['reference_number'],
                'notes' => $validated['notes'],
                'status' => 'completed'
            ]);

            // Update account balance
            $account = Account::findOrFail($validated['account_id']);
            $account->increment('balance', $validated['amount']);

            // Create transaction
            Transaction::create([
                'account_id' => $validated['account_id'],
                'transactionable_type' => Payment::class,
                'transactionable_id' => $payment->id,
                'type' => 'credit',
                'amount' => $validated['amount'],
                'date' => $validated['payment_date'],
                'description' => "Payment received for invoice {$payment->invoice->invoice_number}"
            ]);

            // Update invoice
            $invoice = Invoice::findOrFail($validated['invoice_id']);
            $invoice->amount_paid += $validated['amount'];
            $invoice->balance_due -= $validated['amount'];
            $invoice->status = $invoice->balance_due <= 0 ? 'paid' : 'partially_paid';
            $invoice->save();

            DB::commit();

            return redirect()->route('payments.index')->with('success', 'Payment recorded successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Payment recording failed: ' . $e->getMessage());
            
            return redirect()->back()->with('error', 'Failed to record payment: ' . $e->getMessage());
        }
    }

    public function show(Payment $payment)
    {
        $payment->load(['customer', 'invoice', 'transactions.account']);
        
        return Inertia::render('Payment/Show', [
            'payment' => $payment
        ]);
    }

    public function process(Payment $payment)
    {
        if ($payment->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Payment has already been processed');
        }

        $payment->update(['status' => 'completed']);

        return redirect()->back()
            ->with('success', 'Payment has been processed successfully');
    }

    public function cancel(Payment $payment)
    {
        if ($payment->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Only pending payments can be cancelled');
        }

        DB::beginTransaction();

        try {
            // Reverse invoice changes if payment was associated with one
            if ($payment->invoice_id) {
                $invoice = $payment->invoice;
                $newAmountPaid = $invoice->amount_paid - $payment->amount;
                $newBalanceDue = $invoice->total - $newAmountPaid;

                $invoice->update([
                    'amount_paid' => $newAmountPaid,
                    'balance_due' => $newBalanceDue,
                    'status' => $newBalanceDue >= $invoice->total ? 'sent' : 'partially_paid'
                ]);
            }

            // Reverse account transaction
            foreach ($payment->transactions as $transaction) {
                $account = $transaction->account;
                $account->update([
                    'balance' => $account->balance - $transaction->debit
                ]);
            }

            // Update customer balance
            $customer = $payment->customer;
            $customer->update([
                'balance' => $customer->balance + $payment->amount
            ]);

            // Update payment status
            $payment->update(['status' => 'cancelled']);

            DB::commit();

            return redirect()->back()
                ->with('success', 'Payment has been cancelled successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to cancel payment. ' . $e->getMessage());
        }
    }

    public function storeInvoicePayment(Request $request, Invoice $invoice)
    {
        try {
            // 1. Validate the request
            $validated = $request->validate([
                'amount' => [
                    'required',
                    'numeric',
                    'min:0.01',
                    'max:' . $invoice->balance_due
                ],
                'payment_date' => 'required|date',
                'payment_method' => 'required|in:cash,bank_transfer,mobile_banking',
                'account_id' => 'required|exists:accounts,id',
                'reference_number' => 'nullable|string|max:255',
                'notes' => 'nullable|string',
            ]);

            DB::beginTransaction();

            // 2. Generate payment number
            $latestPayment = Payment::latest()->first();
            $nextPaymentNumber = $latestPayment 
                ? 'PAY-' . str_pad((intval(substr($latestPayment->payment_number, 4)) + 1), 6, '0', STR_PAD_LEFT)
                : 'PAY-000001';

            // 3. Create payment record
            $payment = new Payment();
            $payment->payment_number = $nextPaymentNumber;
            $payment->customer_id = $invoice->customer_id;
            $payment->invoice_id = $invoice->id;
            $payment->account_id = $validated['account_id'];
            $payment->amount = $validated['amount'];
            $payment->payment_date = $validated['payment_date'];
            $payment->payment_method = $validated['payment_method'];
            $payment->reference_number = $validated['reference_number'];
            $payment->notes = $validated['notes'];
            $payment->status = 'completed';
            $payment->save();

            // 4. Update account balance
            $account = Account::findOrFail($validated['account_id']);
            $account->balance += $validated['amount'];
            $account->save();

            // 5. Create transaction record
            $transaction = new Transaction();
            $transaction->account_id = $validated['account_id'];
            $transaction->transactionable_type = Payment::class;
            $transaction->transactionable_id = $payment->id;
            $transaction->type = 'credit';
            $transaction->amount = $validated['amount'];
            $transaction->date = $validated['payment_date'];
            $transaction->description = "Payment received for invoice {$invoice->invoice_number}";
            $transaction->save();

            // 6. Update invoice
            $invoice->amount_paid += $validated['amount'];
            $invoice->balance_due -= $validated['amount'];
            $invoice->status = $invoice->balance_due <= 0 ? 'paid' : 'partially_paid';
            $invoice->save();

            DB::commit();

            return redirect()->back()->with('success', 'Payment recorded successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Payment recording failed: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            // Return the actual error message in development
            if (config('app.debug')) {
                return redirect()->back()->with('error', 'Error: ' . $e->getMessage());
            }
            
            return redirect()->back()->with('error', 'Failed to record payment. Please try again.');
        }
    }
} 