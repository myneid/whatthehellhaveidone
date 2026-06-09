<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('boards', function (Blueprint $table) {
            $table->foreignId('todo_list_id')->nullable()->after('done_list_id')->constrained('board_lists')->nullOnDelete();
            $table->foreignId('work_start_list_id')->nullable()->after('todo_list_id')->constrained('board_lists')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('boards', function (Blueprint $table) {
            $table->dropConstrainedForeignId('todo_list_id');
            $table->dropConstrainedForeignId('work_start_list_id');
        });
    }
};
