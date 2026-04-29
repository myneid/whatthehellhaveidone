<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('github_webhook_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('github_repository_id')->constrained()->cascadeOnDelete();
            $table->string('event_type');
            $table->string('delivery_id')->unique();
            $table->json('payload');
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('failed_at')->nullable();
            $table->text('failure_reason')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['github_repository_id', 'event_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('github_webhook_events');
    }
};
