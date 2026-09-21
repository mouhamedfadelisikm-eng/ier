<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interventions', function (Blueprint $table) {
            $table->id();
            $table->dateTime('date_heure_debut');
            $table->dateTime('date_heure_fin')->nullable();
            $table->string('statut', 30);
            $table->text('compte_rendu')->nullable();
            $table->text('observation')->nullable();
            $table->foreignId('affectation_id')->constrained('affectations')->onDelete('cascade');
            $table->timestamps();

            $table->index('affectation_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interventions');
    }
};
