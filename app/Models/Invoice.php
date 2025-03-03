<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Invoice extends Model
{
    use HasFactory, SoftDeletes;

    const STATUS_DRAFT = 'draft';
    const STATUS_SENT = 'sent';
    const STATUS_PAID = 'paid';
    const STATUS_PARTIALLY_PAID = 'partially_paid';
    const STATUS_OVERDUE = 'overdue';
    const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'invoice_number',
        'customer_id',
        'issue_date',
        'due_date',
        'subtotal',
        'tax',
        'total',
        'amount_paid',
        'balance_due',
        'status',
        'notes'
    ];

    protected $casts = [
        'issue_date' => 'date',
        'due_date' => 'date',
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'total' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'balance_due' => 'decimal:2'
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function recalculateTotals(): void
    {
        $subtotal = $this->items->sum('subtotal');
        $tax = $this->items->sum('tax');
        $total = $this->items->sum('total');
        $balance_due = $total - $this->amount_paid;

        $this->update([
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $total,
            'balance_due' => $balance_due
        ]);
    }

    public function markAsSent()
    {
        DB::beginTransaction();
        try {
            // Update invoice status
            $this->update(['status' => 'sent']);

            // Reduce inventory for each product
            foreach ($this->items as $item) {
                if ($item->product_id) {
                    $inventory = Inventory::where('product_id', $item->product_id)->first();
                    
                    if (!$inventory) {
                        throw new \Exception("Inventory not found for product ID: {$item->product_id}");
                    }

                    if ($inventory->available_quantity < $item->quantity) {
                        throw new \Exception("Insufficient stock for product: {$item->product->name}");
                    }

                    // Reduce available quantity
                    $inventory->decrement('quantity', $item->quantity);
                    $inventory->decrement('available_quantity', $item->quantity);
                }
            }

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
} 