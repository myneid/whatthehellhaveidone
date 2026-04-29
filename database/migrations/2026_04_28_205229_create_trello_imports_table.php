<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trello_imports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('board_id')->nullable()->constrained()->nullOnDelete();
            $table->string('source_board_id')->nullable();
            $table->string('source_board_name')->nullable();
            $table->string('status')->default('pending'); // pending, processing, completed, failed
            $table->string('filename')->nullable();
            $table->json('summary')->nullable();
            $table->json('errors')->nullable();
            $table->json('warnings')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trello_imports');
    }
};
