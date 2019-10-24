<?php

namespace App\GraphQL\Mutations;

use App\Services\UserService;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Auth\Events\Registered;
use Joselfonseca\LighthouseGraphQLPassport\GraphQL\Mutations\BaseAuthResolver;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class NewUser extends BaseAuthResolver
{
    public $userService;
    /**
     * @param UserService $userService
     */
    public function __construct(
        UserService $userService
    ) {
        $this->userService = $userService;
    }

    /**
     * @param array $args
     * @param string $grantType
     * @return mixed
     */
    public function buildCredentials(array $args = [], $grantType = "password")
    {
        $rawData = collect($args)->get('data');
        $credentials = [];
        $credentials['username'] = collect($rawData)->get('email');
        $credentials['password'] = collect($rawData)->get('password');
        $credentials['client_id'] = config('lighthouse-graphql-passport.client_id');
        $credentials['client_secret'] = config('lighthouse-graphql-passport.client_secret');
        $credentials['grant_type'] = $grantType;
        return $credentials;
    }

    /**
     * Return a value for the field.
     *
     * @param null $rootValue Usually contains the result returned from the
     *                        parent field. In this case, it is always `null`.
     * @param  mixed[]  $args The arguments that were passed into the field.
     * @param \Nuwave\Lighthouse\Support\Contracts\GraphQLContext $context
     *                        Arbitrary data that is shared between all fields of a single query.
     * @param \GraphQL\Type\Definition\ResolveInfo $resolveInfo Information about the query
     * itself, such as the execution state, the field name, path to the field from the root, and more.
     * @return mixed
     */
    public function resolve($rootValue, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $user = $this->userService->create($args['data']);
        event(new Registered($user));

        $credentials = $this->buildCredentials($args);
        return $this->makeRequest($credentials);
    }
}
