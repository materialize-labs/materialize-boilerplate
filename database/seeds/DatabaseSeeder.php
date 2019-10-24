<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            CountriesSeeder::class,
            StatesTableSeeder::class,
            RolesAndPermissionsSeeder::class,
            UsersTableSeeder::class,
            SalutationsTableSeeder::class,
            MaritalStatusesTableSeeder::class,
            TagsTableSeeder::class,
            OAuthTablesSeeder::class,
        ]);
    }
}
