<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('github_repositories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('github_account_id')->constrained()->cascadeOnDelete();
            $table->string('github_repo_id');
            $table->string('owner');
            $table->string('name');
            $table->string('full_name');
            $table->boolean('private')->default(false);
            $table->string('html_url');
            $table->string('webhook_id')->nullable();
            $table->string('webhook_secret')->nullable();
            $table->timestamps();

            $table->unique(['github_account_id', 'github_repo_id']);
            $table->index('full_name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('github_repositories');
    }
};
