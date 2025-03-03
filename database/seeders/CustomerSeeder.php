<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'john@example.com',
                'phone_number' => '1234567890',
                'address' => '123 Main St',
                'city' => 'Anytown',
                'state' => 'ST',
                'country' => 'Country',
                'nid_number' => 'NID123456',
                'date_of_birth' => '1990-01-01',
                'package_id' => 1,
                'real_ip_id' => null,
                'expire_date' => '2024-12-31',
                'payment_module' => 'cash',
                'nas_id' => 1,
                'username' => '123456',
                'pppoe_password' => '123456',
            ]
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }
    }
} 