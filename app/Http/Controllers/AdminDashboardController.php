<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        // Calculate monthly income and profit data for charts
        $monthlyData = $this->getMonthlyData();

        // Calculate balances
        $totalBalanceIn = Payment::where('type', '!=', 'supplier')->sum('amount');
        $totalBalanceOut = Payment::where('type', 'supplier')->sum('amount');

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_customers' => Customer::count(),
                'income_this_month' => Payment::where('type', '!=', 'supplier')
                    ->whereBetween('payment_date', [$startOfMonth, $endOfMonth])
                    ->sum('amount'),
                'total_balance' => $totalBalanceIn - $totalBalanceOut,
                'total_balance_in' => $totalBalanceIn,
                'total_balance_out' => $totalBalanceOut,
                'recent_activities' => $this->getRecentActivities(),
                'monthly_income' => $monthlyData['income'],
                'monthly_profit' => $monthlyData['profit']
            ]
        ]);
    }

    private function getRecentActivities()
    {
        // Get recent payments
        $recentPayments = Payment::with(['customer', 'supplier', 'invoice'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($payment) {
                if ($payment->type === 'supplier') {
                    return [
                        'type' => 'expense',
                        'date' => $payment->payment_date,
                        'description' => "Payment made to supplier {$payment->supplier->name}",
                        'amount' => $payment->amount,
                        'status' => $payment->status
                    ];
                } else {
                    return [
                        'type' => 'income',
                        'date' => $payment->payment_date,
                        'description' => $payment->customer 
                            ? "Payment received from {$payment->customer->full_name}"
                            : "Payment received",
                        'amount' => $payment->amount,
                        'status' => $payment->status
                    ];
                }
            });

        // Get recent invoices
        $recentInvoices = Invoice::with('customer')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($invoice) {
                return [
                    'type' => 'invoice',
                    'date' => $invoice->issue_date,
                    'description' => "Invoice created for {$invoice->customer->full_name}",
                    'amount' => $invoice->total,
                    'status' => $invoice->status
                ];
            });

        return $recentPayments->concat($recentInvoices)
            ->sortByDesc('date')
            ->values()
            ->take(10);
    }

    private function getMonthlyData()
    {
        $now = Carbon::now();
        $startDate = $now->copy()->subMonths(11)->startOfMonth();
        $endDate = $now->copy()->endOfMonth();

        // Get monthly data
        $monthlyData = Payment::select(
            DB::raw('YEAR(payment_date) as year'),
            DB::raw('MONTH(payment_date) as month'),
            DB::raw('SUM(CASE WHEN type = "supplier" THEN -amount ELSE amount END) as total')
        )
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        $incomeData = [];
        $profitData = [];

        for ($date = $startDate->copy(); $date <= $endDate; $date->addMonth()) {
            $month = $date->format('M Y');
            
            $monthData = $monthlyData->first(function ($item) use ($date) {
                return $item->year == $date->year && $item->month == $date->month;
            });

            $amount = $monthData ? $monthData->total : 0;

            $incomeData[] = [
                'month' => $month,
                'income' => $amount
            ];

            $profitData[] = [
                'month' => $month,
                'profit' => $amount
            ];
        }

        return [
            'income' => $incomeData,
            'profit' => $profitData
        ];
    }
} 