<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use Lecturize\Addresses\Traits\HasCountry;
use App\Traits\HasState;

/**
 * Class Address
 * @package Lecturize\Addresses\Models
 */
class Address extends Model
{
    use SoftDeletes, HasCountry, HasState;

    /**
     * @inheritdoc
     */
    protected $fillable = [
        'street',
        'street_extra',
        'city',
        'state_id',
        'post_code',
        'country_id',
        'note',
        'lat',
        'lng',
        'addressable_id',
        'addressable_type',
        'is_primary',
        'is_billing',
        'is_shipping',
        'type_id',
        'notes',
    ];

    /**
     * @inheritdoc
     */
    protected $dates = ['deleted_at'];

    public static $rules = [
        'street'       => 'required|string|min:3|max:60',
        'street_extra' => 'string|min:3|max:60',
        'city'         => 'required|string|min:2|max:60',
        'state_id'     => 'required|integer',
        'post_code'    => 'required|min:4|max:10|AlphaDash',
        'country_id'   => 'required|integer',
    ];

    /**
     * @inheritdoc
     */
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->table = config('lecturize.addresses.table', 'addresses');
    }

    /**
     * Get the related model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function addressable() : \Illuminate\Database\Eloquent\Relations\MorphTo
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
        $rules = self::$rules;

        foreach (config('lecturize.addresses.flags', ['public', 'primary', 'billing', 'shipping']) as $flag) {
            $rules['is_'.$flag] = 'boolean';
        }

        return $rules;
    }

    /**
     * Try to fetch the coordinates from Google and store them.
     *
     * @return $this
     */
    public function geocode()
    {
        // build query string
        $query = [];
        $query[] = $this->street       ?: '';
        $query[] = $this->street_extra ?: '';
        $query[] = $this->city         ?: '';
        $query[] = $this->state        ?: '';
        $query[] = $this->post_code    ?: '';
        $query[] = $this->getCountry() ?: '';

        // build query string
        $query = trim(implode(',', array_filter($query)));
        $query = str_replace(' ', '+', $query);

        if (! $query) {
            return $this;
        }

        // build url
        $url = 'https://maps.google.com/maps/api/geocode/json?address='. $query .'&sensor=false';

        // try to get geo codes
        if ($geocode = file_get_contents($url)) {
            $output = json_decode($geocode);

            if (count($output->results) && isset($output->results[0])) {
                if ($geo = $output->results[0]->geometry) {
                    $this->lat = $geo->location->lat;
                    $this->lng = $geo->location->lng;
                }
            }
        }

        return $this;
    }

    /**
     * Get the address as array.
     *
     * @return array
     */
    public function getArray()
    {
        $address = $two = [];

        $two[] = $this->post_code ?: '';
        $two[] = $this->city      ?: '';
        $two[] = $this->state     ? '('. $this->state .')' : '';

        $address[] = $this->street       ?: '';
        $address[] = $this->street_extra ?: '';
        $address[] = implode(' ', array_filter($two));
        $address[] = $this->country_name ?: '';

        if (count($address = array_filter($address)) > 0) {
            return $address;
        }

        return null;
    }

    /**
     * Get the address as html block.
     *
     * @return string
     */
    public function getHtml()
    {
        if ($address = $this->getArray()) {
            return '<address>'. implode('<br />', array_filter($address)) .'</address>';
        }

        return null;
    }

    /**
     * Get the address as a simple line.
     *
     * @param  string  $glue
     * @return string
     */
    public function getLine($glue = ', ')
    {
        if ($address = $this->getArray()) {
            return implode($glue, array_filter($address));
        }

        return null;
    }

    /**
     * Get the state name.
     *
     * @return string
     */
    public function getState()
    {
        if ($this->state && $state = $this->state->name) {
            return $state;
        }

        return '';
    }

    /**
     * Get the country name.
     * @deprecated Unexpected behaviour (would expect $address->country()->get()), use country_name attribute instead.
     *
     * @return string
     */
    public function getCountry()
    {
        if ($this->country && $country = $this->country->name) {
            return $country;
        }

        return '';
    }

    /**
     * Get the country name.
     *
     * @return string
     */
    public function getStateNameAttribute()
    {
        if ($this->state) {
            return $this->state->name;
        }

        return '';
    }

    /**
     * Get the country name.
     *
     * @return string
     */
    public function getStateAbbrAttribute()
    {
        if ($this->state) {
            return $this->state->abbr;
        }

        return '';
    }

    /**
     * Get the country name.
     *
     * @return string
     */
    public function getCountryNameAttribute()
    {
        if ($this->country) {
            return $this->country->name;
        }

        return '';
    }

    /**
     * Get the country code.
     *
     * @param  int  $digits
     * @return string
     */
    public function getCountryCodeAttribute($digits = 2)
    {
        if (! $this->country) {
            return '';
        }

        if ($digits === 3) {
            return $this->country->iso_3166_3;
        }

        return $this->country->iso_3166_2;
    }

    /**
     * Get the route name (without street number).
     *
     * @return string
     */
    public function getRouteAttribute()
    {
        if (preg_match('/([^\d]+)\s?(.+)/i', $this->street, $result)) {
            return $result[1];
        }

        return '';
    }

    /**
     * Get the street number.
     *
     * @return string
     */
    public function getStreetNumberAttribute()
    {
        if (preg_match('/([^\d]+)\s?(.+)/i', $this->street, $result)) {
            return $result[2];
        }

        return '';
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
