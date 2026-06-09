<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('github_card_links', function (Blueprint $table) {
            $table->unsignedInteger('pull_request_number')->nullable()->after('issue_state');
            $table->string('pull_request_url')->nullable()->after('pull_request_number');
            $table->string('pull_request_state')->nullable()->after('pull_request_url');
        });
    }

    public function down(): void
    {
        Schema::table('github_card_links', function (Blueprint $table) {
            $table->dropColumn([
                'pull_request_number',
                'pull_request_url',
                'pull_request_state',
            ]);
        });
    }
};
