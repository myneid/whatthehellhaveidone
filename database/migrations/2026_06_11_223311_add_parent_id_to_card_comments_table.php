<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('card_comments', 'parent_id')) {
            return;
        }

        Schema::table('card_comments', function (Blueprint $table) {
            $table->foreignId('parent_id')
                ->nullable()
                ->after('body')
                ->constrained('card_comments')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('card_comments', 'parent_id')) {
            return;
        }

        Schema::table('card_comments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('parent_id');
        });
    }
};
