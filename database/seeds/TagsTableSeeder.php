<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TagsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = Carbon::now();

        DB::table('tags')->insert([
            [
                'name' => 'Urgent',
                'hex_color' => '#f44242',
                'created_at' => $now->toDateTimeString(),
                'updated_at' => $now->toDateTimeString(),
            ],
        ]);

        DB::table('taggables')->insert([
            [
                'tag_id' => 1,
                'taggable_type' => \App\Models\Matter::class,
                'taggable_id' => 1,
                'created_at' => $now->toDateTimeString(),
                'updated_at' => $now->toDateTimeString(),
            ],
            [
                'tag_id' => 1,
                'taggable_type' => \App\Models\Task::class,
                'taggable_id' => 1,
                'created_at' => $now->toDateTimeString(),
                'updated_at' => $now->toDateTimeString(),
            ],
            [
                'tag_id' => 1,
                'taggable_type' => \App\Models\Task::class,
                'taggable_id' => 3,
                'created_at' => $now->toDateTimeString(),
                'updated_at' => $now->toDateTimeString(),
            ],
        ]);
    }
}
