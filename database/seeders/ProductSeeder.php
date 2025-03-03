<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Wireless Router',
                'code' => 'WR001',
                'description' => 'High-performance wireless router',
                'purchase_price' => 65.00,
                'selling_price' => 89.99,
                'unit' => 'piece',
                'min_stock_alert' => 5,
                'status' => 'active'
            ],
            [
                'name' => 'Network Cable',
                'code' => 'NC001',
                'description' => 'CAT6 network cable',
                'purchase_price' => 8.50,
                'selling_price' => 12.99,
                'unit' => 'piece',
                'min_stock_alert' => 10,
                'status' => 'active'
            ]
        ];

        foreach ($products as $product) {
            $product = Product::create($product);
            
            // Create initial inventory
            $product->inventory()->create([
                'quantity' => 10,
                'available_quantity' => 10
            ]);
        }
    }
} 