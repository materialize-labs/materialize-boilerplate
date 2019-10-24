<?php

namespace App\Models;

use App\ESConfigurators\UserIndexConfigurator;
use App\Exceptions\ValidatorException;
use App\Traits\Searchable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Validation\Rule;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Validator;

class User extends Authenticatable implements MustVerifyEmail
{
    use Notifiable, HasRoles, Searchable, HasApiTokens;

    protected $indexConfigurator = UserIndexConfigurator::class;

    protected $searchRules = [
        //
    ];

    // Here you can specify a mapping for model fields
    protected $mapping = [
        'properties' => [
            'first_name' => [
                'type' => 'text',
                'analyzer' => 'english',
            ],
            'edge_first_name' => [
                'type' => 'text',
                'analyzer' => 'edge_partial_match',
            ],
            'partial_first_name' => [
                'type' => 'text',
                'analyzer' => 'partial_word_match',
            ],
        ]
    ];

    protected $guard_name = 'api';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'title',
        'email',
        'password',
        'phone',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'provider_name', 'provider_id', 'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'email_verified_at' => 'datetime',
        'first_name' => 'string',
        'last_name' => 'string',
        'title' => 'string',
        'email' => 'string',
        'password' => 'string',
        'phone' => 'string',
    ];

    /**
     * Validation rules
     *
     * @var array
     */
    public static $rules = [
        'first_name' => ['nullable', 'string', 'max:255'],
        'last_name'  => ['nullable', 'string', 'max:255'],
        'title'      => ['nullable', 'string', 'max:255'],
        'email'      => ['required', 'email', 'max:255', 'unique:users'],
        'password'   => ['nullable' ,'string', 'min:6'],
        'phone'      => ['nullable', 'phone:US'],
    ];

    /**
     * Using Laravel's unique validation rule can be problematic. It will return a false positive
     * when you attempt to update a field that has a unique value even if the update is on the
     * same element that owns the unique value. This means you cannot modify a record that uses this rule.
     *
     * This modifies the rules to explicitly ignore the element that possesses the unique value if that is
     * the element that is being updated.
     *
     * @param integer|null $id
     * @return array
     */
    public function rules(?int $id) : array
    {
        $rules = self::$rules;
        if (empty($id)) {
            return $rules;
        }

        foreach ($rules as $field => $fieldRules) {
            if (!is_array($fieldRules)) {
                continue;
            }
            $key = array_search('unique:users', $fieldRules);
            if ($key !== false) {
                $rules[$field][$key] = Rule::unique('users')->ignore($id);
            }
        }

        return $rules;
    }

    /**
     * Overrides the normal boot method to set a UUID for new models.
     *
     * @return void
     */
    public static function boot()
    {
        parent::boot();

        // Attach this closure to saving event for validation.
        self::saving(
            function ($model) {
                $v = Validator::make($model->attributes, $model->rules($model->id));
                if ($v->fails()) {
                    throw new ValidatorException('error', $v->errors());
                }
            }
        );
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function linkedSocialAccounts(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(LinkedSocialAccount::class);
    }

    public function getRolesStringAttribute()
    {
        return ucwords(
            str_replace(
                '-',
                ' ',
                implode(
                    ', ',
                    $this->getRoleNames()->toArray()
                )
            )
        );
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * Find the user instance for the given username.
     *
     * @param  string  $username
     * @return \App\User
     */
    public function findForPassport($email)
    {
        return $this->where('email', $email)->first();
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    public function toSearchableArray(): array
    {
        return array_merge($this->toArray(), [
            'edge_first_name' => $this->attributes['first_name'],
            'partial_first_name' => $this->attributes['first_name'],
        ]);
    }

    public function getValueAttribute()
    {
        return $this->id;
    }

    public function getLabelAttribute()
    {
        return $this->full_name;
    }

    /**
     * Get related user task statuses.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function taskStatuses(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(UserTaskStatus::class)->ordered();
    }
}
