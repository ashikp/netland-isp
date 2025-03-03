<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $table = 'inventory';

    protected $fillable = [
        'product_id',
        'quantity',
        'available_quantity',
        'reserved_quantity',
        'location',
        'notes'
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'available_quantity' => 'decimal:2',
        'reserved_quantity' => 'decimal:2',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
