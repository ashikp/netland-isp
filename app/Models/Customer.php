<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Customer extends Authenticatable
{
    protected $fillable = [
        // Personal Section
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'address',
        'city',
        'state',
        'country',
        'nid_number',
        'date_of_birth',
        
        // Package Section
        'package_id',
        'real_ip_id',
        'expire_date',
        'payment_module',
        'nas_id',
        'username',
        'pppoe_password',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'pppoe_password',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'expire_date' => 'date'
    ];

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    public function realIp(): BelongsTo
    {
        return $this->belongsTo(RealIp::class);
    }

    public function nas(): BelongsTo
    {
        return $this->belongsTo(Nas::class);
    }

    // Add an accessor to combine first and last name
    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
} 