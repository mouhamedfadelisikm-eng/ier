<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('couverture_zone', function (Blueprint $table) {
            $table->foreignId('equipe_id')->constrained('equipes')->onDelete('cascade');
            $table->foreignId('zone_id')->constrained('zones')->onDelete('cascade');

            // PK composée : (equipe_id, zone_id) — RG22, RG23
            $table->primary(['equipe_id', 'zone_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('couverture_zone');
    }
};
