<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('types_dechets', function (Blueprint $table) {
            $table->unique('libelle');
        });
    }

    public function down(): void
    {
        Schema::table('types_dechets', function (Blueprint $table) {
            $table->dropUnique(['libelle']);
        });
    }
};
