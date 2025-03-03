<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->foreignId('purchase_id')->nullable()->after('invoice_id')->constrained()->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['purchase_id']);
            $table->dropColumn('purchase_id');
        });
    }
}; 