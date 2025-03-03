<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    public function run(): void
    {
        $packages = [
            [
                'name' => 'Basic Internet',
                'ip_pool_name' => 'pool1',
                'subscription_type' => 'monthly',
                'package_cost' => 29.99,
                'reseller_package_cost' => 24.99
            ],
            [
                'name' => 'Standard Internet',
                'ip_pool_name' => 'pool2',
                'subscription_type' => 'monthly',
                'package_cost' => 49.99,
                'reseller_package_cost' => 39.99
            ],
            [
                'name' => 'Premium Internet',
                'ip_pool_name' => 'pool3',
                'subscription_type' => 'yearly',
                'package_cost' => 79.99,
                'reseller_package_cost' => 69.99
            ]
        ];

        foreach ($packages as $package) {
            Package::create($package);
        }
    }
} 