<?php
namespace App\GraphQL\Mutations;

use App\Exceptions\GraphQLException;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Routing\Exceptions\InvalidSignatureException;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class VerifyEmail
{
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
        $arguments = collect($args)->get('data');
        $request = Request::create(
            config('app.asset_url') . "/email/verify/{$arguments['id']}",
            'GET',
            ['expires' => $arguments['expires'], 'signature' => $arguments['signature']]
        );
        if (!$request->hasValidSignature()) {
            throw new GraphQLException('Email verification link expired or invalid.', 'InvalidLink');
        }
        $user = auth()->user();
        if ($arguments['id'] != $user->getKey()) {
            throw new GraphQLException('User does not match verification code.', 'AuthError');
        }

        if ($user->hasVerifiedEmail()) {
            return [
                'status' => 'EMAIL_ALREADY_VERIFIED',
                'message' => 'Email address has already been verified!'
            ];
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return [
            'status' => 'EMAIL_VERIFIED',
            'message' => 'Email address has been verified!'
        ];
    }

    /**
     * @param                $rootValue
     * @param array          $args
     * @param GraphQLContext $context
     * @param ResolveInfo    $resolveInfo
     * @return array
     */
    public function resendEmail($rootValue, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $user = auth()->user();
        $user->sendEmailVerificationNotification();
        return [
            'status' => 'EMAIL_SENT',
            'message' => 'Verification email has been resent',
        ];
    }
}
