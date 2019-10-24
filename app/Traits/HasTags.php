<?php

namespace App\Traits;

use App\Models\Tag;
use App\Models\Taggable;

trait HasTags
{
    /**
     * Get related tags.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphToMany
     */
    public function tags(): \Illuminate\Database\Eloquent\Relations\MorphToMany
    {
        return $this
            ->morphToMany(Tag::class, 'taggable')
            ->using(Taggable::class);
    }
}
