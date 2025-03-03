<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('real_ips', function (Blueprint $table) {
            $table->decimal('customer_cost', 10, 2)->after('is_used');
            $table->decimal('reseller_cost', 10, 2)->after('customer_cost');
        });
    }

    public function down(): void
    {
        Schema::table('real_ips', function (Blueprint $table) {
            $table->dropColumn(['customer_cost', 'reseller_cost']);
        });
    }
}; 