<?php

namespace Database\Seeders;

use App\Models\Nas;
use Illuminate\Database\Seeder;

class NasSeeder extends Seeder
{
    public function run(): void
    {
        $nas = [
            [
                'name' => 'Main Router',
                'ip_address' => '192.168.1.1',
                'router_type' => 'mikrotik',
                'secret_key' => 'secret123'
            ],
            [
                'name' => 'Backup Router',
                'ip_address' => '192.168.1.2',
                'router_type' => 'mikrotik',
                'secret_key' => 'secret456'
            ]
        ];

        foreach ($nas as $item) {
            Nas::create($item);
        }
    }
} 