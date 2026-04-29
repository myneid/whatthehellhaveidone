<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('document_folder_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('creator_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('last_editor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->string('slug');
            $table->longText('markdown_body')->nullable();
            $table->timestamp('archived_at')->nullable();
            $table->timestamps();

            $table->index(['project_id', 'document_folder_id', 'archived_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_documents');
    }
};
