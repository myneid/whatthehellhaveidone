<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            $table->unsignedInteger('number')->nullable()->after('board_id');
        });

        $boardIds = DB::table('cards')->distinct()->pluck('board_id');

        foreach ($boardIds as $boardId) {
            $cardIds = DB::table('cards')
                ->where('board_id', $boardId)
                ->orderBy('created_at')
                ->orderBy('id')
                ->pluck('id');

            foreach ($cardIds as $index => $cardId) {
                DB::table('cards')
                    ->where('id', $cardId)
                    ->update(['number' => $index + 1]);
            }
        }

        Schema::table('cards', function (Blueprint $table) {
            $table->unsignedInteger('number')->nullable(false)->change();
            $table->unique(['board_id', 'number']);
        });
    }

    public function down(): void
    {
        Schema::table('cards', function (Blueprint $table) {
            $table->dropUnique(['board_id', 'number']);
            $table->dropColumn('number');
        });
    }
};
