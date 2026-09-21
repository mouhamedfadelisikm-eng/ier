<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('historique_points', function (Blueprint $table) {
            $table->foreignId('signalement_id')->nullable()->after('user_id')->constrained('signalements')->nullOnDelete();
            $table->unique('signalement_id', 'historique_points_signalement_unique');
        });
    }

    public function down(): void
    {
        Schema::table('historique_points', function (Blueprint $table) {
            $table->dropUnique('historique_points_signalement_unique');
            $table->dropConstrainedForeignId('signalement_id');
        });
    }
};
