<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('historique_points', function (Blueprint $table) {
            $table->id();
            $table->integer('nombre_points');
            $table->string('motif', 100);
            $table->text('description')->nullable();
            $table->date('date_attribution');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historique_points');
    }
};
