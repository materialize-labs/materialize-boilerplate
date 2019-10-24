<?php

namespace App\ESConfigurators;

use ScoutElastic\IndexConfigurator;
use ScoutElastic\Migratable;

class UserIndexConfigurator extends IndexConfigurator
{
    use Migratable;

    // It's not obligatory to determine name. By default it'll be a snaked class name without `IndexConfigurator` part.
    // protected $name = 'user';

    // You can specify any settings you want, for example, analyzers.
    protected $settings = [
        'analysis' => [
            'analyzer' => [
                'edge_partial_match' => [
                    'tokenizer' => 'edge_word_match_tokenizer',
                    'filter' => [
                        'lowercase',
                    ],
                ],
                'partial_word_match' => [
                    'tokenizer' => 'partial_word_match_tokenizer',
                    'filter' => [
                        'lowercase',
                    ],
                ],
            ],
            'tokenizer' => [
                'edge_word_match_tokenizer' => [
                    'type' => 'edge_ngram',
                    'min_gram' => 3,
                    'max_gram' => 20,
                    'token_chars' => [
                        'letter',
                    ],
                ],
                'partial_word_match_tokenizer' => [
                    'type' => 'ngram',
                    'min_gram' => 5,
                    'max_gram' => 20,
                    'token_chars' => [
                        'letter',
                    ],
                ],
            ],
        ]
    ];
}
