<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Package extends Model
{
    protected $fillable = [
        'name',
        'ip_pool_name',
        'subscription_type',
        'package_cost',
        'reseller_package_cost'
    ];

    protected $casts = [
        'package_cost' => 'decimal:2',
        'reseller_package_cost' => 'decimal:2'
    ];

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }
}
