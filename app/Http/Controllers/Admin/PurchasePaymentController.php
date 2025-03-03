<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use App\Models\Account;
use App\Models\Transaction;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchasePaymentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'purchase_id' => 'required|exists:purchases,id',
            'account_id' => 'required|exists:accounts,id',
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string',
            'reference_number' => 'nullable|string',
            'notes' => 'nullable|string'
        ]);

        DB::beginTransaction();

        try {
            $purchase = Purchase::findOrFail($validated['purchase_id']);
            $supplier = $purchase->supplier;
            
            // Generate payment number
            $latestPayment = Payment::latest()->first();
            $nextPaymentNumber = $latestPayment 
                ? 'PAY-' . str_pad((intval(substr($latestPayment->payment_number, 4)) + 1), 6, '0', STR_PAD_LEFT)
                : 'PAY-000001';
            
            // Create payment record
            $payment = $purchase->payments()->create([
                'payment_number' => $nextPaymentNumber,
                'type' => 'supplier',
                'supplier_id' => $purchase->supplier_id,
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
            $account->decrement('balance', $validated['amount']);

            // Update supplier balance
            $supplier->updateBalances(0, $validated['amount']);

            // Create transaction record
            Transaction::create([
                'account_id' => $validated['account_id'],
                'transactionable_type' => Payment::class,
                'transactionable_id' => $payment->id,
                'type' => 'debit',
                'amount' => $validated['amount'],
                'date' => $validated['payment_date'],
                'description' => "Payment made to supplier {$supplier->name}"
            ]);

            // Update purchase payment status
            $purchase->paid_amount += $validated['amount'];
            $purchase->due_amount -= $validated['amount'];
            $purchase->payment_status = $purchase->due_amount <= 0 ? 'paid' : 'partially_paid';
            $purchase->save();

            DB::commit();
            return back()->with('success', 'Payment recorded successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to record payment: ' . $e->getMessage());
        }
    }
} 