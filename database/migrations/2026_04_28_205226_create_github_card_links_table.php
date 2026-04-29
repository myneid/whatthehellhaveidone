<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('github_card_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('card_id')->constrained()->cascadeOnDelete();
            $table->foreignId('github_repository_id')->constrained()->cascadeOnDelete();
            $table->string('github_issue_id');
            $table->unsignedInteger('issue_number');
            $table->string('issue_url');
            $table->string('issue_state')->default('open');
            $table->string('last_synced_source')->nullable();
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();

            $table->unique('card_id');
            $table->index('github_issue_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('github_card_links');
    }
};
