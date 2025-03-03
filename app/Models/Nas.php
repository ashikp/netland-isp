<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Nas extends Model
{
    protected $table = 'nas';
    
    protected $fillable = [
        'name',
        'ip_address',
        'router_type',
        'secret_key'
    ];

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }
} 