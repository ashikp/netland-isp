<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class RealIp extends Model
{
    protected $fillable = [
        'ip_address',
        'is_used',
        'customer_cost',
        'reseller_cost'
    ];

    protected $casts = [
        'is_used' => 'boolean',
        'customer_cost' => 'decimal:2',
        'reseller_cost' => 'decimal:2'
    ];

    public function customer(): HasOne
    {
        return $this->hasOne(Customer::class);
    }
} 