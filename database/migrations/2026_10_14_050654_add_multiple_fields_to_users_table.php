<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
            $table->string('city')->nullable()->after('email');
            $table->string('country')->nullable()->after('city');
            $table->string('role')->nullable()->after('country');
            $table->string('affiliated_institution')->nullable()->after('role');
            $table->string('is_approved')->default('pending')->after('affiliated_institution');
            $table->string('image')->nullable()->after('is_approved');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
            $table->dropColumn('city');
            $table->dropColumn('country');
            $table->dropColumn('role');
            $table->dropColumn('affiliated_institution');
            $table->dropColumn('is_approved');
            $table->dropColumn('image');
        });
    }
};
