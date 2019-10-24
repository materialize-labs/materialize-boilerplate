<?php

use \Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('test', function () {

//     $matter = \App\Models\Matter::find(1);
//     dd($matter->primaryContact->first_name);

//     // $organization = \App\Models\Organization::find(1);
//     // dd($organization->users);

//     $contact = \App\Models\Contact::find(1);
//     dd($contact->sub_type);

//     $contactTypes = \App\Models\ContactType::all();
//     foreach ($contactTypes as $key => $value) {
//         dd($value->label);
//     }
// });

Route::get('redirect/{driver}', 'Auth\SocialAuthController@redirectToProvider')
    ->name('login.provider')
    ->where('driver', implode('|', config('auth.socialite.drivers')));

Route::get('{driver}/callback', 'Auth\SocialAuthController@handleProviderCallback')
    ->name('login.callback')
    ->where('driver', implode('|', config('auth.socialite.drivers')));

Route::view('password/reset', 'app')->name('password.request');
Route::view('login', 'app')->name('login');
Route::view('password/reset/{token}', 'app')->name('password.reset');
Route::view('email/resend', 'app')->name('verification.resend');
Route::view('email/verify', 'app')->name('verification.notice');
Route::view('email/verify/{id}', 'app')->name('verification.verify');

Route::view('/{any}', 'app')->where('any', '.*');
