<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Transfer;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class TransferController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $transfers = Transfer::with(['fromAccount', 'toAccount'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Transfer/Index', [
            'transfers' => $transfers
        ]);
    }

    public function create()
    {
        return Inertia::render('Transfer/Create', [
            'accounts' => Account::where('is_active', true)->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'from_account_id' => 'required|exists:accounts,id',
            'to_account_id' => 'required|exists:accounts,id|different:from_account_id',
            'amount' => 'required|numeric|min:0.01',
            'transfer_date' => 'required|date',
            'reference_number' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Generate transfer number
        $latestTransfer = Transfer::latest()->first();
        $nextTransferNumber = $latestTransfer 
            ? 'TRF-' . str_pad((intval(substr($latestTransfer->transfer_number, 4)) + 1), 6, '0', STR_PAD_LEFT)
            : 'TRF-000001';

        DB::beginTransaction();

        try {
            // Get accounts
            $fromAccount = Account::findOrFail($validated['from_account_id']);
            $toAccount = Account::findOrFail($validated['to_account_id']);

            // Check if from_account has sufficient balance
            if ($fromAccount->balance < $validated['amount']) {
                throw new \Exception('Insufficient balance in source account.');
            }

            // Create transfer
            $transfer = Transfer::create([
                'transfer_number' => $nextTransferNumber,
                'from_account_id' => $validated['from_account_id'],
                'to_account_id' => $validated['to_account_id'],
                'amount' => $validated['amount'],
                'transfer_date' => $validated['transfer_date'],
                'reference_number' => $validated['reference_number'],
                'description' => $validated['description'],
                'status' => 'completed'
            ]);

            // Create debit transaction for from_account
            Transaction::create([
                'transaction_number' => 'TRX-' . strtoupper(uniqid()),
                'account_id' => $validated['from_account_id'],
                'transfer_id' => $transfer->id,
                'debit' => $validated['amount'],
                'credit' => 0,
                'balance' => $fromAccount->balance - $validated['amount'],
                'transaction_date' => $validated['transfer_date'],
                'description' => "Transfer: {$nextTransferNumber} (Sent to {$toAccount->name})"
            ]);

            // Create credit transaction for to_account
            Transaction::create([
                'transaction_number' => 'TRX-' . strtoupper(uniqid()),
                'account_id' => $validated['to_account_id'],
                'transfer_id' => $transfer->id,
                'debit' => 0,
                'credit' => $validated['amount'],
                'balance' => $toAccount->balance + $validated['amount'],
                'transaction_date' => $validated['transfer_date'],
                'description' => "Transfer: {$nextTransferNumber} (Received from {$fromAccount->name})"
            ]);

            // Update account balances
            $fromAccount->update(['balance' => $fromAccount->balance - $validated['amount']]);
            $toAccount->update(['balance' => $toAccount->balance + $validated['amount']]);

            DB::commit();

            return redirect()->route('transfers.show', $transfer)
                ->with('success', 'Transfer completed successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to process transfer. ' . $e->getMessage());
        }
    }

    public function show(Transfer $transfer)
    {
        $transfer->load(['fromAccount', 'toAccount', 'transactions']);
        
        return Inertia::render('Transfer/Show', [
            'transfer' => $transfer
        ]);
    }

    public function cancel(Transfer $transfer)
    {
        if ($transfer->status === 'cancelled') {
            return redirect()->back()
                ->with('error', 'Transfer is already cancelled.');
        }

        DB::beginTransaction();

        try {
            // Get accounts
            $fromAccount = $transfer->fromAccount;
            $toAccount = $transfer->toAccount;

            // Check if to_account has sufficient balance to reverse
            if ($toAccount->balance < $transfer->amount) {
                throw new \Exception('Insufficient balance in destination account to cancel transfer.');
            }

            // Create reversal transactions
            Transaction::create([
                'transaction_number' => 'TRX-' . strtoupper(uniqid()),
                'account_id' => $fromAccount->id,
                'transfer_id' => $transfer->id,
                'debit' => 0,
                'credit' => $transfer->amount,
                'balance' => $fromAccount->balance + $transfer->amount,
                'transaction_date' => now(),
                'description' => "Transfer Reversal: {$transfer->transfer_number}"
            ]);

            Transaction::create([
                'transaction_number' => 'TRX-' . strtoupper(uniqid()),
                'account_id' => $toAccount->id,
                'transfer_id' => $transfer->id,
                'debit' => $transfer->amount,
                'credit' => 0,
                'balance' => $toAccount->balance - $transfer->amount,
                'transaction_date' => now(),
                'description' => "Transfer Reversal: {$transfer->transfer_number}"
            ]);

            // Update account balances
            $fromAccount->update(['balance' => $fromAccount->balance + $transfer->amount]);
            $toAccount->update(['balance' => $toAccount->balance - $transfer->amount]);

            // Update transfer status
            $transfer->update(['status' => 'cancelled']);

            DB::commit();

            return redirect()->route('transfers.show', $transfer)
                ->with('success', 'Transfer cancelled successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to cancel transfer. ' . $e->getMessage());
        }
    }
} 