<?php

namespace App\GraphQL\Mutations;

use App\Services\UserService;
use GraphQL\Type\Definition\ResolveInfo;
use Joselfonseca\LighthouseGraphQLPassport\GraphQL\Mutations\BaseAuthResolver;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Illuminate\Support\Facades\Auth;

class ChangePassword extends BaseAuthResolver
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
        if (!Auth::user()) {
            throw new \Illuminate\Auth\AuthenticationException('You are not authenticated');
        }

        if ((int)Auth::user()->id !== (int)$args['data']['id']) {
            throw new \Illuminate\Auth\AuthenticationException('You cannot edit another users\' profile');
        }

        $user = $this->userService->update(Auth::user(), $args['data']);
        return $user;
    }
}
