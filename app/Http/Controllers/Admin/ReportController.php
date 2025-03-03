<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use App\Models\Payment;
use App\Models\Account;
use App\Models\Product;
use App\Models\Expense;
use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Exports\MonthlySalesExport;
use App\Exports\MonthlyStockExport;
use App\Exports\MonthlyIncomeExport;
use App\Exports\MonthlyExpenseExport;
use App\Exports\MonthlyPaymentExport;
use App\Exports\MonthlyAccountsBalanceExport;

class ReportController extends Controller
{
    public function monthlySales(Request $request)
    {
        $date = $request->date ? Carbon::parse($request->date) : now();
        $startOfMonth = $date->copy()->startOfMonth();
        $endOfMonth = $date->copy()->endOfMonth();

        $sales = Invoice::with(['customer', 'items.product'])
            ->whereBetween('issue_date', [$startOfMonth, $endOfMonth])
            ->get()
            ->map(function ($invoice) {
                return [
                    'date' => $invoice->issue_date->format('Y-m-d'),
                    'invoice_number' => $invoice->invoice_number,
                    'customer' => $invoice->customer->name,
                    'total' => $invoice->total,
                    'items' => $invoice->items->map(function ($item) {
                        return [
                            'product' => $item->product->name,
                            'quantity' => $item->quantity,
                            'price' => $item->price,
                            'total' => $item->total
                        ];
                    })
                ];
            });

        return Inertia::render('Admin/Reports/MonthlySales', [
            'sales' => $sales,
            'total' => $sales->sum('total'),
            'date' => $date->format('Y-m')
        ]);
    }

    public function monthlyStock(Request $request)
    {
        $date = $request->date ? Carbon::parse($request->date) : now();
        $startOfMonth = $date->copy()->startOfMonth();
        $endOfMonth = $date->copy()->endOfMonth();

        $products = Product::with(['inventory'])->get()->map(function ($product) use ($startOfMonth, $endOfMonth) {
            // Get purchase quantities for the month
            $purchaseQuantity = DB::table('purchase_items')
                ->join('purchases', 'purchases.id', '=', 'purchase_items.purchase_id')
                ->where('purchase_items.product_id', $product->id)
                ->whereBetween('purchases.purchase_date', [$startOfMonth, $endOfMonth])
                ->sum('purchase_items.quantity');

            // Get sales quantities for the month
            $salesQuantity = DB::table('invoice_items')
                ->join('invoices', 'invoices.id', '=', 'invoice_items.invoice_id')
                ->where('invoice_items.item_type', 'product')
                ->where('invoice_items.item_id', $product->id)
                ->whereBetween('invoices.issue_date', [$startOfMonth, $endOfMonth])
                ->sum('invoice_items.quantity');

            // Calculate opening stock
            $openingStock = $product->inventory->quantity - ($purchaseQuantity - $salesQuantity);

            return [
                'name' => $product->name,
                'opening_stock' => $openingStock,
                'purchases' => $purchaseQuantity,
                'sales' => $salesQuantity,
                'closing_stock' => $product->inventory->quantity
            ];
        });

        return Inertia::render('Admin/Reports/MonthlyStock', [
            'products' => $products,
            'date' => $date->format('Y-m')
        ]);
    }

    public function monthlyIncome(Request $request)
    {
        $date = $request->date ? Carbon::parse($request->date) : now();
        $startOfMonth = $date->copy()->startOfMonth();
        $endOfMonth = $date->copy()->endOfMonth();

        $income = Payment::where('type', '!=', 'supplier')
            ->whereBetween('payment_date', [$startOfMonth, $endOfMonth])
            ->with(['customer', 'invoice'])
            ->get()
            ->map(function ($payment) {
                return [
                    'date' => $payment->payment_date->format('Y-m-d'),
                    'payment_number' => $payment->payment_number,
                    'customer' => $payment->customer->name ?? 'N/A',
                    'invoice' => $payment->invoice->invoice_number ?? 'N/A',
                    'amount' => $payment->amount,
                    'payment_method' => $payment->payment_method
                ];
            });

        return Inertia::render('Admin/Reports/MonthlyIncome', [
            'income' => $income,
            'total' => $income->sum('amount'),
            'date' => $date->format('Y-m')
        ]);
    }

    public function monthlyExpense(Request $request)
    {
        $date = $request->date ? Carbon::parse($request->date) : now();
        $startOfMonth = $date->copy()->startOfMonth();
        $endOfMonth = $date->copy()->endOfMonth();

        $expenses = Expense::whereBetween('expense_date', [$startOfMonth, $endOfMonth])
            ->with('transactions.account')
            ->get()
            ->map(function ($expense) {
                return [
                    'date' => $expense->expense_date->format('Y-m-d'),
                    'expense_number' => $expense->expense_number,
                    'category' => $expense->category,
                    'amount' => $expense->amount,
                    'payment_method' => $expense->payment_method,
                    'account' => $expense->transactions->first()->account->name ?? 'N/A'
                ];
            });

        return Inertia::render('Admin/Reports/MonthlyExpense', [
            'expenses' => $expenses,
            'total' => $expenses->sum('amount'),
            'date' => $date->format('Y-m')
        ]);
    }

    public function monthlyPayment(Request $request)
    {
        $date = $request->date ? Carbon::parse($request->date) : now();
        $startOfMonth = $date->copy()->startOfMonth();
        $endOfMonth = $date->copy()->endOfMonth();

        $payments = Payment::whereBetween('payment_date', [$startOfMonth, $endOfMonth])
            ->with(['customer', 'supplier', 'invoice', 'purchase', 'account'])
            ->get()
            ->map(function ($payment) {
                return [
                    'date' => $payment->payment_date->format('Y-m-d'),
                    'payment_number' => $payment->payment_number,
                    'type' => $payment->type,
                    'entity' => $payment->type === 'supplier' ? $payment->supplier->name : $payment->customer->name ?? 'N/A',
                    'reference' => $payment->type === 'supplier' ? $payment->purchase->purchase_number : $payment->invoice->invoice_number ?? 'N/A',
                    'amount' => $payment->amount,
                    'account' => $payment->account->name
                ];
            });

        return Inertia::render('Admin/Reports/MonthlyPayment', [
            'payments' => $payments,
            'total_in' => $payments->where('type', '!=', 'supplier')->sum('amount'),
            'total_out' => $payments->where('type', 'supplier')->sum('amount'),
            'date' => $date->format('Y-m')
        ]);
    }

    public function monthlyAccountsBalance(Request $request)
    {
        $date = $request->date ? Carbon::parse($request->date) : now();
        $startOfMonth = $date->copy()->startOfMonth();
        $endOfMonth = $date->copy()->endOfMonth();

        $accounts = Account::with(['transactions' => function ($query) use ($startOfMonth, $endOfMonth) {
            $query->whereBetween('date', [$startOfMonth, $endOfMonth]);
        }])->get()->map(function ($account) use ($startOfMonth) {
            // Calculate opening balance by summing all transactions before start of month
            $openingBalance = DB::table('transactions')
                ->where('account_id', $account->id)
                ->where('date', '<', $startOfMonth)
                ->sum(DB::raw('CASE WHEN type = "credit" THEN amount ELSE -amount END'));

            $transactions = $account->transactions->sortBy('date');
            
            return [
                'name' => $account->name,
                'opening_balance' => $openingBalance,
                'credits' => $transactions->where('type', 'credit')->sum('amount'),
                'debits' => $transactions->where('type', 'debit')->sum('amount'),
                'closing_balance' => $openingBalance + 
                    $transactions->where('type', 'credit')->sum('amount') - 
                    $transactions->where('type', 'debit')->sum('amount'),
                'transactions' => $transactions->map(function ($transaction) {
                    return [
                        'date' => $transaction->date ? $transaction->date->format('Y-m-d') : null,
                        'description' => $transaction->description,
                        'type' => $transaction->type,
                        'amount' => $transaction->amount
                    ];
                })
            ];
        });

        return Inertia::render('Admin/Reports/MonthlyAccountsBalance', [
            'accounts' => $accounts,
            'date' => $date->format('Y-m')
        ]);
    }

    public function index()
    {
        return Inertia::render('Admin/Reports/Index');
    }

    public function export($type, $format, Request $request)
    {
        $date = $request->date ? Carbon::parse($request->date) : now();
        $method = "get{$type}Data";
        
        if (!method_exists($this, $method)) {
            abort(404);
        }

        $data = $this->$method($date);
        $exportClass = "App\\Exports\\{$type}Export";

        if ($format === 'pdf') {
            return (new $exportClass($data, "{$type} Report"))->download();
        }

        return \Excel::download(new $exportClass($data), "{$type}_{$date->format('Y_m')}.xlsx");
    }

    private function getMonthlySalesData($date)
    {
        $startOfMonth = $date->copy()->startOfMonth();
        $endOfMonth = $date->copy()->endOfMonth();

        return Invoice::with(['customer', 'items.product'])
            ->whereBetween('issue_date', [$startOfMonth, $endOfMonth])
            ->get()
            ->map(function ($invoice) {
                return [
                    'date' => $invoice->issue_date->format('Y-m-d'),
                    'invoice_number' => $invoice->invoice_number,
                    'customer' => $invoice->customer->name,
                    'total' => $invoice->total
                ];
            });
    }

    // Similar private methods for other reports...
} 