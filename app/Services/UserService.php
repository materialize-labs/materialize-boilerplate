<?php

namespace App\Services;

use Illuminate\Support\Collection;
use App\Repositories as Repos;
use App\Models;
use Illuminate\Support\Facades\Hash;
use Propaganistas\LaravelPhone\PhoneNumber;

class UserService
{
    /**
     * @param array $attributes
     * @return Models\User|null
     */
    public function create(array $attributes) : ?Models\User
    {
        $role = 'owner';
        $attributes['password'] = !empty($attributes['password'])
            ? Hash::make($attributes['password'])
            : null;

        if (!empty($attributes['phone'])) {
            $attributes['phone'] = PhoneNumber::make($attributes['phone'], 'US')->formatE164();
        }

        $user = Models\User::create($attributes);
        $user->assignRole($role);

        return $user;
    }

    /**
     * @param array $attributes
     * @return Models\User|null
     */
    public function invite(array $attributes) : ?Models\User
    {
        $attributes['password'] = !empty($attributes['password'])
            ? Hash::make($attributes['password'])
            : null;

        $user = Models\User::create($attributes);
        $user->assignRole($attributes['role']);

        return $user;
    }

    /**
     * Update a user record.
     *
     * @param Models\User $user
     * @param array       $attributes
     * @return Models\User|null
     */
    public function update(Models\User $user, array $attributes): ?Models\User
    {
        if (!empty($attributes['password'])) {
            $attributes['password'] = Hash::make($attributes['password']);
        }

        if (!empty($attributes['phone'])) {
            $attributes['phone'] = PhoneNumber::make($attributes['phone'], 'US')->formatE164();
        }

        $user->update($attributes);

        return $user->refresh();
    }

    /**
     * Updates a user's roles.
     *
     * @param Models\User $user
     * @param array       $roles
     * @return Models\User
     */
    public function updateUserRoles(Models\User $user, array $roles) : Models\User
    {
        if (isset($roles)) {
            $user->syncRoles($roles);
        } else {
            $user->roles()->detach();
            $user->assignRole('User');
        }

        return $user;
    }
}
