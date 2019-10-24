<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;
use \App\Exceptions\GraphQLException;

use Closure;

class CheckOrg
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $userOrgID = Auth::user()->organization->id;
        // dd($request->all()['query']);
        dd($request->input('query'));

        return $next($request);
    }
}
