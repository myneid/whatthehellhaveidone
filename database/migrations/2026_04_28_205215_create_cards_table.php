<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('board_id')->constrained()->cascadeOnDelete();
            $table->foreignId('list_id')->constrained('board_lists')->cascadeOnDelete();
            $table->foreignId('creator_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->longText('description')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->string('priority')->default('medium'); // low, medium, high, urgent
            $table->timestamp('due_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('archived_at')->nullable();
            $table->string('source_system')->nullable();
            $table->string('source_card_id')->nullable();
            $table->string('source_board_id')->nullable();
            $table->timestamps();

            $table->index(['board_id', 'list_id', 'position']);
            $table->index(['list_id', 'archived_at']);
            $table->index('creator_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cards');
    }
};
