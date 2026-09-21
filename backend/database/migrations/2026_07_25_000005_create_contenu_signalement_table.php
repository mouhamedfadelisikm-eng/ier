<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contenu_signalement', function (Blueprint $table) {
            $table->foreignId('signalement_id')->constrained('signalements')->onDelete('cascade');
            $table->foreignId('type_dechet_id')->constrained('types_dechets')->onDelete('cascade');
            $table->decimal('quantite_estime', 10, 2)->nullable();
            $table->decimal('volume_estime', 10, 2)->nullable();
            $table->string('dangerosite', 30)->nullable();
            $table->text('remarque')->nullable();

            $table->primary(['signalement_id', 'type_dechet_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contenu_signalement');
    }
};
