<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('github_card_links', function (Blueprint $table) {
            $table->boolean('request_copilot_review')->default(true)->after('issue_state');
        });
    }

    public function down(): void
    {
        Schema::table('github_card_links', function (Blueprint $table) {
            $table->dropColumn('request_copilot_review');
        });
    }
};
