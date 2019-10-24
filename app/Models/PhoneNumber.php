<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Validation\Rule;
use Validator;
use App\Exceptions\ValidatorException;
use \Propaganistas\LaravelPhone\PhoneNumber as FormatNumber;

class PhoneNumber extends Model
{
    use SoftDeletes;

    /**
     * @inheritdoc
     */
    protected $fillable = [
        'phone_number',
        'phoneable_id',
        'phoneable_type',
        'is_primary',
        'type_id',
        'notes',
    ];

    /**
     * @inheritdoc
     */
    protected $dates = ['deleted_at'];

    public static $rules = [
        'phone_number' =>'phone:US',
        'is_primary' => 'boolean',
    ];

    /**
     * @inheritdoc
     */
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->table = 'phone_numbers';
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
                $model->phone_number = FormatNumber::make($model->phone_number, 'US')->formatE164();
                $v = Validator::make($model->attributes, $model->getValidationRules($model->id));
                if ($v->fails()) {
                    throw new ValidatorException('error', $v->errors());
                }
            }
        );
    }

    /**
     * Get the related model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function phoneable() : \Illuminate\Database\Eloquent\Relations\MorphTo
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
