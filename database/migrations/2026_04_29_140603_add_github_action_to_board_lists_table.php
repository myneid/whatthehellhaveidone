<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('board_lists', function (Blueprint $table) {
            $table->string('github_action')->nullable()->after('wip_limit');
        });
    }

    public function down(): void
    {
        Schema::table('board_lists', function (Blueprint $table) {
            $table->dropColumn('github_action');
        });
    }
};
