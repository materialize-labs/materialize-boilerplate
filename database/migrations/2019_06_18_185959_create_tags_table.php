<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTagsTable extends Migration
{
    protected $table = 'tags';
    protected $morph = 'taggables';

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create($this->table, function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('hex_color')->nullable();

            $table->timestamps();
        });

        Schema::create($this->morph, function (Blueprint $table) {
            $table->bigInteger('tag_id')->unsigned();
            $table->morphs('taggable');

            $table->timestamps();

            $table->foreign('tag_id')->references('id')->on('tags');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists($this->morph);
        Schema::dropIfExists($this->table);
    }
}
