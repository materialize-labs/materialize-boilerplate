<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait HasParent
{
    /**
     * Query scope to remove children from results.
     *
     * @param  Builder $builder
     * @return Builder
     */
    public function scopeParentOnly(Builder $builder): Builder
    {
        return $builder->whereNull($this->determineParentColumn());
    }

    /**
     * Determine the name of column containing parent id.
     *
     * @return string
     */
    protected function determineParentColumn(): string
    {
        return $this->parentColumn ?? 'parent_id';
    }
}
