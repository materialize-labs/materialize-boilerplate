<?php

namespace App\Traits;

use Lecturize\Addresses\Exceptions\FailedValidationException;
use App\Models\Website;

trait HasWebsites
{
    /**
     * Get all websites for this model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany
     */
    public function websites() : \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(Website::class, 'websiteable');
    }

    /**
     * Check if model has an website.
     *
     * @return bool
     */
    public function hasWebsite()
    {
        return (bool) $this->websites()->count();
    }

    /**
     * Add an website to this model.
     *
     * @param  array  $attributes
     * @return mixed
     *
     * @throws \Exception
     */
    public function addWebsite(array $attributes)
    {
        $attributes = $this->loadWebsiteAttributes($attributes);

        return $this->websites()->updateOrCreate($attributes);
    }

    /**
     * Updates the given website.
     *
     * @param  Website  $website
     * @param  array    $attributes
     * @return bool
     *
     * @throws \Exception
     */
    public function updateWebsite(Website $website, array $attributes)
    {
        $attributes = $this->loadWebsiteAttributes($attributes);

        return $website->fill($attributes)->save();
    }

    /**
     * Deletes given website.
     *
     * @param  Website  $website
     * @return bool
     *
     * @throws \Exception
     */
    public function deleteWebsite(Website $website)
    {
        if ($this !== $website->websiteable()->first()) {
            return false;
        }

        return $website->delete();
    }

    /**
     * Deletes all the websites of this model.
     *
     * @return bool
     */
    public function flushWebsites()
    {
        return $this->websites()->delete();
    }

    /**
     * Get the primary website.
     *
     * @return Website
     */
    public function getPrimaryWebsite()
    {
        return $this->websites()->orderBy('is_primary', 'DESC')->first();
    }

    /**
     * Add country id to attributes array.
     *
     * @param  array  $attributes
     * @return array
     * @throws FailedValidationException
     */
    public function loadWebsiteAttributes(array $attributes)
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
        $validator = $this->validateWebsite($attributes);

        if ($validator->fails()) {
            throw new FailedValidationException('Validator failed for: '. implode(', ', $attributes));
        }

        // return attributes array with country_id key/value pair
        return $attributes;
    }

    /**
     * Validate the website.
     *
     * @param  array  $attributes
     * @return \Illuminate\Contracts\Validation\Validator
     */
    public function validateWebsite(array $attributes)
    {
        $rules = Website::getValidationRules();

        return validator($attributes, $rules);
    }
}
