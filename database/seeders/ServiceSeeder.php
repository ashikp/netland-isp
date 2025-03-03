<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name' => 'Installation',
                'description' => 'Initial setup and installation service',
                'price' => 50.00,
                'status' => 'active'
            ],
            [
                'name' => 'Router Configuration',
                'description' => 'Configure router settings and security',
                'price' => 25.00,
                'status' => 'active'
            ],
            [
                'name' => 'Network Troubleshooting',
                'description' => 'Diagnose and fix network issues',
                'price' => 35.00,
                'status' => 'active'
            ]
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
} 