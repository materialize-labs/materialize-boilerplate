<?php

namespace App\Traits;

use ScoutElastic\Searchable as ElasticSearchable;

trait Searchable
{
    use ElasticSearchable {
        ElasticSearchable::bootSearchable as bootElasticSearchable;
    }

    /**
     * Override Scout Elastic boot method and directly call Scout boot method.
     *
     * @return void
     */
    public static function bootSearchable(): void
    {
        self::sourceBootSearchable();
    }
}
