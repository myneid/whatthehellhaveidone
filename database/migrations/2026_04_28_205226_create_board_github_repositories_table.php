<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('board_github_repositories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('board_id')->constrained()->cascadeOnDelete();
            $table->foreignId('github_repository_id')->constrained()->cascadeOnDelete();
            $table->string('sync_direction')->default('two_way'); // github_to_board, board_to_github, two_way
            $table->json('status_mapping')->nullable();
            $table->timestamps();

            $table->unique(['board_id', 'github_repository_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('board_github_repositories');
    }
};
