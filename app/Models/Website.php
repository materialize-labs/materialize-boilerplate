<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Website extends Model
{
    use SoftDeletes;

    /**
     * @inheritdoc
     */
    protected $fillable = [
        'website',
        'websiteable_id',
        'websiteable_type',
        'is_primary',
        'notes',
    ];

    /**
     * @inheritdoc
     */
    protected $dates = ['deleted_at'];

    public static $rules = [
        'website' =>'required|url',
        'is_primary' => 'boolean',
    ];

    /**
     * @inheritdoc
     */
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->table = 'websites';
    }

    /**
     * Get the related model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function websiteable() : \Illuminate\Database\Eloquent\Relations\MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the validation rules.
     *
     * @return array
     */
    public static function getValidationRules()
    {
        return self::$rules;
    }

    /**
     * Get the type string.
     *
     * @return mixed
     */
    public function getContactTypeAttribute()
    {
        return $this->type()->first() ?
            $this->type()->first()->type :
            null;
    }
}
