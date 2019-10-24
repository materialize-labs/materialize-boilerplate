<?php

namespace App\Traits;

use Lecturize\Addresses\Exceptions\FailedValidationException;
use App\Models\Email;

trait HasEmails
{
    /**
     * Get all emails for this model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany
     */
    public function emails() : \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(Email::class, 'emailable');
    }

    /**
     * Check if model has an email.
     *
     * @return bool
     */
    public function hasEmail()
    {
        return (bool) $this->emails()->count();
    }

    /**
     * Add an email to this model.
     *
     * @param  array  $attributes
     * @return mixed
     *
     * @throws \Exception
     */
    public function addEmail(array $attributes)
    {
        $attributes = $this->loadEmailAttributes($attributes);

        return $this->emails()->updateOrCreate($attributes);
    }

    /**
     * Updates the given email.
     *
     * @param  Email  $email
     * @param  array    $attributes
     * @return bool
     *
     * @throws \Exception
     */
    public function updateEmail(Email $email, array $attributes)
    {
        $attributes = $this->loadEmailAttributes($attributes);

        return $email->fill($attributes)->save();
    }

    /**
     * Deletes given email.
     *
     * @param  Email  $email
     * @return bool
     *
     * @throws \Exception
     */
    public function deleteEmail(Email $email)
    {
        if ($this !== $email->emailable()->first()) {
            return false;
        }

        return $email->delete();
    }

    /**
     * Deletes all the emails of this model.
     *
     * @return bool
     */
    public function flushEmails()
    {
        return $this->emails()->delete();
    }

    /**
     * Get the primary email.
     *
     * @return Email
     */
    public function getPrimaryEmail()
    {
        return $this->emails()->orderBy('is_primary', 'DESC')->first();
    }

    /**
     * Add country id to attributes array.
     *
     * @param  array  $attributes
     * @return array
     * @throws FailedValidationException
     */
    public function loadEmailAttributes(array $attributes)
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
        $validator = $this->validateEmail($attributes);

        if ($validator->fails()) {
            throw new FailedValidationException('Validator failed for: '. implode(', ', $attributes));
        }

        // return attributes array with country_id key/value pair
        return $attributes;
    }

    /**
     * Validate the email.
     *
     * @param  array  $attributes
     * @return \Illuminate\Contracts\Validation\Validator
     */
    public function validateEmail(array $attributes)
    {
        $rules = Email::getValidationRules();

        return validator($attributes, $rules);
    }
}
