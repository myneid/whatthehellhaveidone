<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('discord_webhooks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('board_id')->constrained()->cascadeOnDelete();
            $table->text('encrypted_webhook_url');
            $table->boolean('enabled')->default(true);
            $table->json('event_settings')->nullable();
            $table->timestamp('last_success_at')->nullable();
            $table->timestamp('last_failed_at')->nullable();
            $table->timestamps();

            $table->unique('board_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('discord_webhooks');
    }
};
