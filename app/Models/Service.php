<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'status'
    ];

    protected $casts = [
        'price' => 'decimal:2'
    ];
} 