<?php

namespace App\GraphQL\Queries;

use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class OrgUsers
{
    /**
     * Return a value for the field.
     *
     * @param  null  $rootValue Usually contains the result returned
                from the parent field. In this case, it is always `null`.
     * @param  mixed[]  $args The arguments that were passed into the field.
     * @param  \Nuwave\Lighthouse\Support\Contracts\GraphQLContext  $context
                Arbitrary data that is shared between all fields of a single query.
     * @param  \GraphQL\Type\Definition\ResolveInfo  $resolveInfo Information about
                the query itself, such as the execution state, the field name, path
                to the field from the root, and more.
     * @return mixed
     */
    public function resolve(
        $rootValue,
        array $args,
        GraphQLContext $context,
        ResolveInfo $resolveInfo
    ) {
        if (!Auth::user()) {
            throw new \Illuminate\Auth\AuthenticationException('You are not authenticated');
        }

        $organizationId = Auth::user()->organization_id;
        if (!$organizationId) {
            return  User::where('id', Auth::user()->id)->get();
        } else {
            return User::where('organization_id', $organizationId)->get();
        }
    }
}
