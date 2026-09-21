<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appartenance_equipe', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('equipe_id')->constrained('equipes')->onDelete('cascade');
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            $table->string('fonction', 100);

            // PK composée : (user_id, equipe_id, date_debut) — RG8
            $table->primary(['user_id', 'equipe_id', 'date_debut']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appartenance_equipe');
    }
};
