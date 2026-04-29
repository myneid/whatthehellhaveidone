<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('boards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->string('visibility')->default('team');
            $table->string('background_color')->nullable();
            $table->timestamp('archived_at')->nullable();
            $table->timestamps();

            $table->index(['project_id', 'archived_at']);
            $table->index('owner_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('boards');
    }
};
