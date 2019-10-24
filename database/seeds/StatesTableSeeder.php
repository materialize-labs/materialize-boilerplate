<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('us_states')->insert(['abbr' => 'AL', 'name' => 'Alabama']);
        DB::table('us_states')->insert(['abbr' => 'AK', 'name' => 'Alaska',]);
        DB::table('us_states')->insert(['abbr' => 'AZ', 'name' => 'Arizona',]);
        DB::table('us_states')->insert(['abbr' => 'AR', 'name' => 'Arkansas',]);
        DB::table('us_states')->insert(['abbr' => 'CA', 'name' => 'California',]);
        DB::table('us_states')->insert(['abbr' => 'CO', 'name' => 'Colorado',]);
        DB::table('us_states')->insert(['abbr' => 'CT', 'name' => 'Connecticut',]);
        DB::table('us_states')->insert(['abbr' => 'DE', 'name' => 'Delaware',]);
        DB::table('us_states')->insert(['abbr' => 'DC', 'name' => 'District of Columbia',]);
        DB::table('us_states')->insert(['abbr' => 'FL', 'name' => 'Florida',]);
        DB::table('us_states')->insert(['abbr' => 'GA', 'name' => 'Georgia',]);
        DB::table('us_states')->insert(['abbr' => 'HI', 'name' => 'Hawaii',]);
        DB::table('us_states')->insert(['abbr' => 'ID', 'name' => 'Idaho',]);
        DB::table('us_states')->insert(['abbr' => 'IL', 'name' => 'Illinois',]);
        DB::table('us_states')->insert(['abbr' => 'IN', 'name' => 'Indiana',]);
        DB::table('us_states')->insert(['abbr' => 'IA', 'name' => 'Iowa',]);
        DB::table('us_states')->insert(['abbr' => 'KS', 'name' => 'Kansas',]);
        DB::table('us_states')->insert(['abbr' => 'KY', 'name' => 'Kentucky',]);
        DB::table('us_states')->insert(['abbr' => 'LA', 'name' => 'Louisiana',]);
        DB::table('us_states')->insert(['abbr' => 'ME', 'name' => 'Maine',]);
        DB::table('us_states')->insert(['abbr' => 'MD', 'name' => 'Maryland',]);
        DB::table('us_states')->insert(['abbr' => 'MA', 'name' => 'Massachusetts',]);
        DB::table('us_states')->insert(['abbr' => 'MI', 'name' => 'Michigan',]);
        DB::table('us_states')->insert(['abbr' => 'MN', 'name' => 'Minnesota',]);
        DB::table('us_states')->insert(['abbr' => 'MS', 'name' => 'Mississippi',]);
        DB::table('us_states')->insert(['abbr' => 'MO', 'name' => 'Missouri',]);
        DB::table('us_states')->insert(['abbr' => 'MT', 'name' => 'Montana',]);
        DB::table('us_states')->insert(['abbr' => 'NE', 'name' => 'Nebraska',]);
        DB::table('us_states')->insert(['abbr' => 'NV', 'name' => 'Nevada',]);
        DB::table('us_states')->insert(['abbr' => 'NH', 'name' => 'New Hampshire',]);
        DB::table('us_states')->insert(['abbr' => 'NJ', 'name' => 'New Jersey',]);
        DB::table('us_states')->insert(['abbr' => 'NM', 'name' => 'New Mexico',]);
        DB::table('us_states')->insert(['abbr' => 'NY', 'name' => 'New York',]);
        DB::table('us_states')->insert(['abbr' => 'NC', 'name' => 'North Carolina',]);
        DB::table('us_states')->insert(['abbr' => 'ND', 'name' => 'North Dakota',]);
        DB::table('us_states')->insert(['abbr' => 'OH', 'name' => 'Ohio',]);
        DB::table('us_states')->insert(['abbr' => 'OK', 'name' => 'Oklahoma',]);
        DB::table('us_states')->insert(['abbr' => 'OR', 'name' => 'Oregon',]);
        DB::table('us_states')->insert(['abbr' => 'PA', 'name' => 'Pennsylvania',]);
        DB::table('us_states')->insert(['abbr' => 'RI', 'name' => 'Rhode Island',]);
        DB::table('us_states')->insert(['abbr' => 'SC', 'name' => 'South Carolina',]);
        DB::table('us_states')->insert(['abbr' => 'SD', 'name' => 'South Dakota',]);
        DB::table('us_states')->insert(['abbr' => 'TN', 'name' => 'Tennessee',]);
        DB::table('us_states')->insert(['abbr' => 'TX', 'name' => 'Texas',]);
        DB::table('us_states')->insert(['abbr' => 'UT', 'name' => 'Utah',]);
        DB::table('us_states')->insert(['abbr' => 'VT', 'name' => 'Vermont',]);
        DB::table('us_states')->insert(['abbr' => 'VA', 'name' => 'Virginia',]);
        DB::table('us_states')->insert(['abbr' => 'WA', 'name' => 'Washington',]);
        DB::table('us_states')->insert(['abbr' => 'WV', 'name' => 'West Virginia',]);
        DB::table('us_states')->insert(['abbr' => 'WI', 'name' => 'Wisconsin',]);
        DB::table('us_states')->insert(['abbr' => 'WY', 'name' => 'Wyoming',]);
    }
}
