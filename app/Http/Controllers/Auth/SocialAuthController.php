<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\SocialAccountService;
use App\Services\UserService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    private $userService;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/dashboard';

    /**
     * Create a new controller instance.
     *
     * @param UserService $userService
     */
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
        $this->middleware('guest')->except('logout');
    }

    /**
     * Redirect the user to the provider authentication page.
     *
     * @return \Illuminate\Http\Response
     */
    public function redirectToProvider($driver)
    {
        return Socialite::driver($driver)->redirect();
    }

    /**
     * Obtain the user information from provider.
     *
     * @param $driver
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function handleProviderCallback($driver)
    {
        try {
            $user = Socialite::driver($driver)->user();
        } catch (\Exception $e) {
            return redirect('/login');
        }

        $credentials = $this->buildCredentials([
            'access_token' => $user->token,
            'accessToken' => $user->token,
            'provider' => $driver
        ], 'social');

        $token = $this->makeRequest($credentials);

        $redirectPath = env('APP_URL', 'http://localhost').'/dashboard';

        return redirect($redirectPath)
            ->cookie('token', $token['access_token'], 0, '/', null, false, false);
    }

    /**
     * @param array $args
     * @param string $grantType
     * @return mixed
     */
    public function buildCredentials(array $args = [], $grantType = "password")
    {
        $credentials = $args;
        $credentials['client_id'] = config('lighthouse-graphql-passport.client_id');
        $credentials['client_secret'] = config('lighthouse-graphql-passport.client_secret');
        $credentials['grant_type'] = $grantType;
        return $credentials;
    }

    public function makeRequest(array $credentials)
    {
        $request = Request::create('oauth/token', 'POST', $credentials, [], [], [
            'HTTP_Accept' => 'application/json'
        ]);
        $response = app()->handle($request);
        $decodedResponse = json_decode($response->getContent(), true);
        if ($response->getStatusCode() != 200) {
            throw new AuthorizationException($decodedResponse['message']);
        }
        return $decodedResponse;
    }
}
