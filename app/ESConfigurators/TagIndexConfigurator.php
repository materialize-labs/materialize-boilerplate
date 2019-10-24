<?php

namespace App\ESConfigurators;

use ScoutElastic\IndexConfigurator;
use ScoutElastic\Migratable;

class TagIndexConfigurator extends IndexConfigurator
{
    use Migratable;

    protected $settings = [
        'analysis' => [
            'analyzer' => [
                'edge_partial_match' => [
                    'tokenizer' => 'edge_word_match_tokenizer',
                    'filter' => ['lowercase'],
                ],
            ],
            'tokenizer' => [
                'edge_word_match_tokenizer' => [
                    'type' => 'edge_ngram',
                    'min_gram' => 3,
                    'max_gram' => 20,
                    'token_chars' => ['letter'],
                ],
            ],
        ],
    ];
}
