<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerDashboardController extends Controller
{
    public function dashboard()
    {
        $customer = auth('customer')->user();
        
        return Inertia::render('Customer/Dashboard', [
            'customer' => [
                'id' => $customer->id,
                'full_name' => $customer->full_name,
                'username' => $customer->username,
                'balance' => $customer->balance,
                'package' => $customer->package,
                'status' => $customer->status,
            ],
            'currentPackage' => $customer->package()->with('subscription_type')->first(),
            'recentInvoices' => $customer->invoices()
                ->with('items')
                ->latest()
                ->take(5)
                ->get(),
            'recentPayments' => $customer->payments()
                ->with('invoice')
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }

    public function invoices()
    {
        $customer = auth('customer')->user();
        
        return Inertia::render('Customer/Invoices', [
            'invoices' => $customer->invoices()
                ->with('items')
                ->latest()
                ->paginate(10)
        ]);
    }

    public function payments()
    {
        $customer = auth('customer')->user();
        
        return Inertia::render('Customer/Payments', [
            'payments' => $customer->payments()
                ->with(['invoice', 'account'])
                ->latest()
                ->paginate(10)
        ]);
    }

    public function ledger()
    {
        $customer = auth('customer')->user();
        
        $transactions = collect();
        
        // Add invoices to transactions
        $customer->invoices->each(function ($invoice) use ($transactions) {
            $transactions->push([
                'date' => $invoice->issue_date,
                'type' => 'Invoice',
                'description' => "Invoice #{$invoice->invoice_number}",
                'debit' => $invoice->total,
                'credit' => 0,
                'balance' => 0, // Will calculate later
            ]);
        });
        
        // Add payments to transactions
        $customer->payments->each(function ($payment) use ($transactions) {
            $transactions->push([
                'date' => $payment->payment_date,
                'type' => 'Payment',
                'description' => "Payment #{$payment->payment_number}",
                'debit' => 0,
                'credit' => $payment->amount,
                'balance' => 0, // Will calculate later
            ]);
        });
        
        // Sort by date and calculate running balance
        $transactions = $transactions->sortBy('date')->values();
        $balance = 0;
        
        $transactions->transform(function ($item) use (&$balance) {
            $balance += $item['debit'] - $item['credit'];
            $item['balance'] = $balance;
            return $item;
        });

        return Inertia::render('Customer/Ledger', [
            'transactions' => $transactions
        ]);
    }
} 