<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            
            // Personal Section
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone_number');
            $table->text('address');
            $table->string('city');
            $table->string('state');
            $table->string('country');
            $table->string('nid_number')->unique();
            $table->date('date_of_birth');
            
            // Package Section
            $table->foreignId('package_id')->constrained('packages');
            $table->foreignId('real_ip_id')->nullable()->constrained('real_ips');
            $table->date('expire_date');
            $table->enum('payment_module', ['cash', 'bank_transfer', 'mobile_banking']);
            $table->foreignId('nas_id')->constrained('nas');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
}; 