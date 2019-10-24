<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = Carbon::now();

        DB::table('users')->insert([
            0 => [
                'first_name' => 'Testy',
                'last_name' => 'McTesterson',
                'title' => 'Partner',
                'phone' => '+13104599863',
                'email' => 'admin@test.com',
                'password' => Hash::make('password'),
                'avatar' => '/images/avatar-1.png',
                'created_at' => $now->toDateTimeString(),
                'updated_at' => $now->toDateTimeString(),
            ],
            1 => [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'title' => 'Associate',
                'phone' => '+13102849182',
                'email' => 'owner@test.com',
                'password' => Hash::make('password'),
                'avatar' => null,
                'created_at' => $now->toDateTimeString(),
                'updated_at' => $now->toDateTimeString(),
            ],
            2 => [
                'first_name' => 'Jane',
                'last_name' => 'Doe',
                'title' => 'Associate',
                'phone' => '+13109482745',
                'email' => 'user@test.com',
                'password' => Hash::make('password'),
                'avatar' => null,
                'created_at' => $now->toDateTimeString(),
                'updated_at' => $now->toDateTimeString(),
            ],
        ]);

        DB::table('model_has_roles')->insert([
            0 => [
                'role_id' => 1,
                'model_type' => 'App\Models\User',
                'model_id' => 1,
            ],
            1 => [
                'role_id' => 3,
                'model_type' => 'App\Models\User',
                'model_id' => 1,
            ],
            2 => [
                'role_id' => 4,
                'model_type' => 'App\Models\User',
                'model_id' => 2,
            ],
            3 => [
                'role_id' => 5,
                'model_type' => 'App\Models\User',
                'model_id' => 3,
            ],
        ]);
    }
}
