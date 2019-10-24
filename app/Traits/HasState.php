<?php

namespace App\Traits;

use App\Models\States;

/**
 * Class HasCountry
 * @package Lecturize\Addresses\Traits;
 */
trait HasState
{
    /**
     * Get the models state.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function state() : \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(States::class);
    }
}
