<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ExpenseController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $expenses = Expense::with(['transactions.account'])
            ->latest()
            ->paginate(10);
        
        return Inertia::render('Expense/Index', [
            'expenses' => $expenses,
            'categories' => $this->getExpenseCategories()
        ]);
    }

    public function create()
    {
        return Inertia::render('Expense/Create', [
            'accounts' => Account::where('is_active', true)->get(),
            'categories' => $this->getExpenseCategories()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'expense_date' => 'required|date',
            'payment_method' => 'required|in:cash,bank_transfer,mobile_banking',
            'account_id' => 'required|exists:accounts,id',
            'reference_number' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Generate expense number
        $latestExpense = Expense::latest()->first();
        $nextExpenseNumber = $latestExpense 
            ? 'EXP-' . str_pad((intval(substr($latestExpense->expense_number, 4)) + 1), 6, '0', STR_PAD_LEFT)
            : 'EXP-000001';

        DB::beginTransaction();

        try {
            // Create expense
            $expense = Expense::create([
                'expense_number' => $nextExpenseNumber,
                'category' => $validated['category'],
                'amount' => $validated['amount'],
                'expense_date' => $validated['expense_date'],
                'payment_method' => $validated['payment_method'],
                'reference_number' => $validated['reference_number'],
                'description' => $validated['description'],
            ]);

            // Create transaction
            $account = Account::findOrFail($validated['account_id']);
            $transaction = new Transaction([
                'account_id' => $validated['account_id'],
                'type' => 'debit',
                'amount' => $validated['amount'],
                'date' => $validated['expense_date'],
                'description' => "Expense: {$nextExpenseNumber} - {$validated['category']}"
            ]);

            $expense->transactions()->save($transaction);

            // Update account balance
            $account->update([
                'balance' => $account->balance - $validated['amount']
            ]);

            DB::commit();

            return redirect()->route('admin.expenses.show', $expense)
                ->with('success', 'Expense recorded successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to record expense. ' . $e->getMessage());
        }
    }

    public function show(Expense $expense)
    {
        $expense->load(['transactions.account']);
        
        return Inertia::render('Expense/Show', [
            'expense' => $expense,
            'categories' => $this->getExpenseCategories()
        ]);
    }

    public function edit(Expense $expense)
    {
        $expense->load(['transactions.account']);

        return Inertia::render('Expense/Edit', [
            'expense' => $expense,
            'accounts' => Account::where('is_active', true)->get(),
            'categories' => $this->getExpenseCategories()
        ]);
    }

    public function update(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'expense_date' => 'required|date',
            'payment_method' => 'required|in:cash,bank_transfer,mobile_banking',
            'account_id' => 'required|exists:accounts,id',
            'reference_number' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            // Reverse previous transaction
            $oldTransaction = $expense->transactions->first();
            if ($oldTransaction) {
                $oldAccount = $oldTransaction->account;
                $oldAccount->update([
                    'balance' => $oldAccount->balance + $expense->amount
                ]);
            }

            // Update expense
            $expense->update([
                'category' => $validated['category'],
                'amount' => $validated['amount'],
                'expense_date' => $validated['expense_date'],
                'payment_method' => $validated['payment_method'],
                'reference_number' => $validated['reference_number'],
                'description' => $validated['description'],
            ]);

            // Create new transaction
            $account = Account::findOrFail($validated['account_id']);
            
            // Delete old transaction and create new one
            $expense->transactions()->delete();
            $transaction = new Transaction([
                'account_id' => $validated['account_id'],
                'type' => 'debit',
                'amount' => $validated['amount'],
                'date' => $validated['expense_date'],
                'description' => "Expense: {$expense->expense_number} - {$validated['category']}"
            ]);

            $expense->transactions()->save($transaction);

            // Update new account balance
            $account->update([
                'balance' => $account->balance - $validated['amount']
            ]);

            DB::commit();

            return redirect()->route('admin.expenses.show', $expense)
                ->with('success', 'Expense updated successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to update expense. ' . $e->getMessage());
        }
    }

    public function destroy(Expense $expense)
    {
        DB::beginTransaction();

        try {
            // Reverse transaction
            $transaction = $expense->transactions->first();
            if ($transaction) {
                $account = $transaction->account;
                $account->update([
                    'balance' => $account->balance + $expense->amount
                ]);
            }

            // Delete expense and associated transactions
            $expense->transactions()->delete();
            $expense->delete();

            DB::commit();

            return redirect()->route('expenses.index')
                ->with('success', 'Expense deleted successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to delete expense. ' . $e->getMessage());
        }
    }

    private function getExpenseCategories()
    {
        return [
            'utilities' => 'Utilities',
            'rent' => 'Rent',
            'salaries' => 'Salaries',
            'equipment' => 'Equipment',
            'maintenance' => 'Maintenance',
            'internet' => 'Internet',
            'software' => 'Software',
            'marketing' => 'Marketing',
            'office_supplies' => 'Office Supplies',
            'travel' => 'Travel',
            'training' => 'Training',
            'insurance' => 'Insurance',
            'taxes' => 'Taxes',
            'other' => 'Other',
        ];
    }
} 