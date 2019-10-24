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
            ]
        ]);
    }
}
