<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('affectations', function (Blueprint $table) {
            $table->id();
            $table->dateTime('date_heure_affectation');
            $table->text('observation')->nullable();
            $table->foreignId('equipe_id')->constrained('equipes')->onDelete('cascade');
            $table->foreignId('signalement_id')->constrained('signalements')->onDelete('cascade');
            $table->timestamps();

            // Index pour performances sur les lookups fréquents
            $table->index('signalement_id');
            $table->index('equipe_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('affectations');
    }
};
