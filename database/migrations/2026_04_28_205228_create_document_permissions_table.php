<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('subject_type'); // folder, document
            $table->unsignedBigInteger('subject_id');
            $table->string('grantee_type'); // user, group, role
            $table->unsignedBigInteger('grantee_id')->nullable();
            $table->string('grantee_role')->nullable(); // owner, admin, member, viewer
            $table->string('access_level'); // none, view, edit, manage
            $table->timestamps();

            $table->index(['subject_type', 'subject_id']);
            $table->index('project_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_permissions');
    }
};
