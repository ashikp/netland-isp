<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $accounts = Account::latest()->paginate(10);
        
        return Inertia::render('Account/Index', [
            'accounts' => $accounts
        ]);
    }

    public function create()
    {
        return Inertia::render('Account/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'account_number' => 'required|string|unique:accounts',
            'type' => 'required|in:asset,liability,equity,income,expense',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        Account::create($validated);

        return redirect()->route('admin.accounts.index')
            ->with('success', 'Account created successfully');
    }

    public function edit(Account $account)
    {
        return Inertia::render('Account/Edit', [
            'account' => $account
        ]);
    }

    public function update(Request $request, Account $account)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'account_number' => 'required|string|unique:accounts,account_number,' . $account->id,
            'type' => 'required|in:asset,liability,equity,income,expense',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $account->update($validated);

        return redirect()->route('admin.accounts.index')
            ->with('success', 'Account updated successfully');
    }

    public function destroy(Account $account)
    {
        // Check if account has any transactions before deleting
        if ($account->transactions()->exists()) {
            return redirect()->back()
                ->with('error', 'Cannot delete account with existing transactions');
        }

        $account->delete();
        return redirect()->back()
            ->with('success', 'Account deleted successfully');
    }
} 