<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('ip_pool_name');
            $table->enum('subscription_type', ['daily', 'weekly', 'monthly', 'yearly']);
            $table->decimal('package_cost', 10, 2);
            $table->decimal('reseller_package_cost', 10, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
}; 