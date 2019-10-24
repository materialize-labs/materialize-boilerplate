<?php

namespace App\Traits;

use Lecturize\Addresses\Exceptions\FailedValidationException;
use App\Models\PhoneNumber;

trait HasPhoneNumbers
{
    /**
     * Get all phoneNumbers for this model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany
     */
    public function phoneNumbers() : \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(PhoneNumber::class, 'phoneable');
    }

    /**
     * Check if model has an phoneNumber.
     *
     * @return bool
     */
    public function hasPhoneNumber()
    {
        return (bool) $this->phoneNumbers()->count();
    }

    /**
     * Add an phoneNumber to this model.
     *
     * @param  array  $attributes
     * @return mixed
     *
     * @throws \Exception
     */
    public function addPhoneNumber(array $attributes)
    {
        $attributes = $this->loadPhoneNumberAttributes($attributes);

        return $this->phoneNumbers()->updateOrCreate($attributes);
    }

    /**
     * Updates the given phoneNumber.
     *
     * @param  PhoneNumber  $phoneNumber
     * @param  array    $attributes
     * @return bool
     *
     * @throws \Exception
     */
    public function updatePhoneNumber(PhoneNumber $phoneNumber, array $attributes)
    {
        $attributes = $this->loadPhoneNumberAttributes($attributes);

        return $phoneNumber->fill($attributes)->save();
    }

    /**
     * Deletes given phoneNumber.
     *
     * @param  PhoneNumber  $phoneNumber
     * @return bool
     *
     * @throws \Exception
     */
    public function deletePhoneNumber(PhoneNumber $phoneNumber)
    {
        if ($this !== $phoneNumber->phoneable()->first()) {
            return false;
        }

        return $phoneNumber->delete();
    }

    /**
     * Deletes all the phoneNumbers of this model.
     *
     * @return bool
     */
    public function flushPhoneNumbers()
    {
        return $this->phoneNumbers()->delete();
    }

    /**
     * Get the primary phoneNumber.
     *
     * @return PhoneNumber
     */
    public function getPrimaryPhoneNumber()
    {
        return $this->phoneNumbers()->orderBy('is_primary', 'DESC')->first();
    }

    /**
     * Add country id to attributes array.
     *
     * @param  array  $attributes
     * @return array
     * @throws FailedValidationException
     */
    public function loadPhoneNumberAttributes(array $attributes)
    {
        // return if no country given
        if (! isset($attributes['country'])) {
            return $attributes;
        }

        // find country
        $country = Countries::where('iso_3166_2', $attributes['country'])
                            ->orWhere('iso_3166_3', $attributes['country'])
                            ->first();

        // unset country from attributes array
        unset($attributes['country']);

        // add country_id to attributes array
        if (is_object($country) && isset($country->id)) {
            $attributes['country_id'] = $country->id;
        }

        // run validation
        $validator = $this->validatePhoneNumber($attributes);

        if ($validator->fails()) {
            throw new FailedValidationException('Validator failed for: '. implode(', ', $attributes));
        }

        // return attributes array with country_id key/value pair
        return $attributes;
    }

    /**
     * Validate the phoneNumber.
     *
     * @param  array  $attributes
     * @return \Illuminate\Contracts\Validation\Validator
     */
    public function validatePhoneNumber(array $attributes)
    {
        $rules = PhoneNumber::getValidationRules();

        return validator($attributes, $rules);
    }
}
