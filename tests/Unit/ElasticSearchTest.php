<?php

namespace Tests\Unit;

use App\Models\User;
use Mockery;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class ElasticSearchTest extends TestCase
{
    /**
     * Test a successful login using a normal API call.
     *
     * @return void
     */
    public function testCanSearchUsers()
    {
        $expected = [
            "id" => 2,
            "email" => "owner@test.com",
            "email_verified_at" => null,
            "first_name" => "John",
            "last_name" => "Doe",
            "phone" => "+13102849182",
        ];

        $this->mockElasticsearch($expected);

        $results = User::search('john')->get()->toArray();

        $this->assertEquals($expected['id'], $results[0]['id']);
        $this->assertEquals($expected['email'], $results[0]['email']);
        $this->assertEquals($expected['first_name'], $results[0]['first_name']);
        $this->assertEquals($expected['last_name'], $results[0]['last_name']);
        $this->assertEquals($expected['phone'], $results[0]['phone']);
    }

    /**
     * Mocks an ElasticSearch `search` call.
     *
     * @param  array $expected Expected result.
     * @return void
     */
    protected function mockElasticsearch(array $expected): void
    {
        $this
            ->instance(
                'scout_elastic.client',
                Mockery::mock(\Elasticsearch\Client::class, function ($mock) use ($expected) {
                    $mock->shouldReceive('search')->andReturn([
                        'hits' => [
                            'total' => 1,
                            'hits' => [
                                [
                                    '_id' => $expected['id'],
                                    '_source' => $expected,
                                ],
                            ],
                        ],
                    ]);
                }));
    }
}
