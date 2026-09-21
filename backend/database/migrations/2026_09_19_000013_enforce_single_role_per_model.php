<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('model_has_roles', function (Blueprint $table): void {
            $table->unique(
                ['model_type', 'model_id'],
                'model_has_roles_single_role_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::table('model_has_roles', function (Blueprint $table): void {
            $table->dropUnique('model_has_roles_single_role_unique');
        });
    }
};
