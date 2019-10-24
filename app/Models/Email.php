<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Email extends Model
{
    use SoftDeletes;

    /**
     * @inheritdoc
     */
    protected $fillable = [
        'email',
        'emailable_id',
        'emailable_type',
        'is_primary',
        'type_id',
        'notes',
    ];

    /**
     * @inheritdoc
     */
    protected $dates = ['deleted_at'];

    public static $rules = [
        'email' =>'required|email',
        'is_primary' => 'boolean',
    ];

    /**
     * @inheritdoc
     */
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->table = 'emails';
    }

    /**
     * Get the related model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function emailable() : \Illuminate\Database\Eloquent\Relations\MorphTo
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
     * Get the email as array.
     *
     * @return array
     */
    public function getArray()
    {
        $email = $two = [];

        $two[] = $this->post_code ?: '';
        $two[] = $this->city      ?: '';
        $two[] = $this->state     ? '('. $this->state .')' : '';

        $email[] = $this->street       ?: '';
        $email[] = $this->street_extra ?: '';
        $email[] = implode(' ', array_filter($two));
        $email[] = $this->country_name ?: '';

        if (count($email = array_filter($email)) > 0) {
            return $email;
        }

        return null;
    }

    /**
     * Get the type for this model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\belongsTo
     */
    public function type() : \Illuminate\Database\Eloquent\Relations\belongsTo
    {
        return $this->belongsTo(\App\Models\ContactType::class, 'type_id');
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
