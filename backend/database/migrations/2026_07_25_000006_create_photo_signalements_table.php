<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('photo_signalements', function (Blueprint $table) {
            $table->id();
            $table->string('url', 255);
            $table->text('description')->nullable();
            $table->foreignId('signalement_id')->constrained('signalements')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('photo_signalements');
    }
};
