<?php

namespace App\Models;

use App\ESConfigurators\TagIndexConfigurator;
use Illuminate\Database\Eloquent\Model;
use ScoutElastic\Searchable;

class Tag extends Model
{
    use Searchable;

    public $fillable = [
        'name',
        'hex_color',
    ];

    protected $indexConfigurator = TagIndexConfigurator::class;

    protected $mapping = [
        'properties' => [
            'name' => [
                'type' => 'text',
                'analyzer' => 'edge_partial_match',
            ],
        ],
    ];

    public function getValueAttribute(): int
    {
        return $this->getKey();
    }

    public function getLabelAttribute(): string
    {
        return $this->name;
    }
}
