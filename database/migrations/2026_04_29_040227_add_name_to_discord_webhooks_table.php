<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('discord_webhooks', function (Blueprint $table) {
            $table->string('name')->default('Discord')->after('board_id');
        });
    }

    public function down(): void
    {
        Schema::table('discord_webhooks', function (Blueprint $table) {
            $table->dropColumn('name');
        });
    }
};
