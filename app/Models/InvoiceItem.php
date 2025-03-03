<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class InvoiceItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_id',
        'item_type',
        'item_id',
        'description',
        'quantity',
        'unit_price',
        'subtotal',
        'tax',
        'discount',
        'total'
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2'
    ];

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function itemDetails(): MorphTo
    {
        return $this->morphTo('item', 'item_type', 'item_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($item) {
            // Calculate subtotal
            $item->subtotal = $item->quantity * $item->unit_price;
            
            // Calculate tax amount from percentage
            $item->tax = $item->subtotal * ($item->tax / 100);
            
            // Calculate total
            $item->total = $item->subtotal + $item->tax - $item->discount;
        });
    }
} 