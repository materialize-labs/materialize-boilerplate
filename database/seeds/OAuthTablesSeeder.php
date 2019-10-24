<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class OAuthTablesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = Carbon::now();

        DB::table('oauth_clients')->insert([
            0 => [
                'id' => 1,
                'user_id' => null,
                'name' => 'Materialize Boilerplate Personal Access Client',
                'secret' => 'SFDcYId49UWOtWoM1N9TDkYdAAWb5DaR2nIcmnV0',
                'redirect' => env('APP_URL'),
                'personal_access_client' => 1,
                'password_client' => 0,
                'revoked' => 0,
                'created_at' => $now->toDateTimeString(),
                'updated_at' => $now->toDateTimeString(),
            ],
            1 => [
                'id' => 2,
                'user_id' => null,
                'name' => 'Materialize Boilerplate Password Grant Client',
                'secret' => 'FPeQbNsjvYsg0PhoDo04ODeww02yUOGtt7Rw7fk6',
                'redirect' => env('APP_URL'),
                'personal_access_client' => 0,
                'password_client' => 1,
                'revoked' => 0,
                'created_at' => $now->toDateTimeString(),
                'updated_at' => $now->toDateTimeString(),
            ],
        ]);

        DB::table('oauth_personal_access_clients')->insert([
            0 => [
                'id' => 1,
                'client_id' => 1,
                'created_at' => $now->toDateTimeString(),
                'updated_at' => $now->toDateTimeString(),
            ],
        ]);
    }
}
