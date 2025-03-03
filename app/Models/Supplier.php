<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone_number',
        'address',
        'credit_balance',
        'debit_balance',
        'balance',
        'status'
    ];

    protected $casts = [
        'credit_balance' => 'decimal:2',
        'debit_balance' => 'decimal:2',
        'balance' => 'decimal:2',
    ];

    public function updateBalances($creditAmount = 0, $debitAmount = 0)
    {
        $this->credit_balance += $creditAmount;
        $this->debit_balance += $debitAmount;
        $this->balance = $this->credit_balance - $this->debit_balance;
        $this->save();
    }
}
