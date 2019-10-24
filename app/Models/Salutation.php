<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Salutation extends Model
{
    protected $table = 'salutations';

    public function getValueAttribute()
    {
        return $this->id;
    }

    public function getLabelAttribute()
    {
        return $this->salutation;
    }
}
