<?php

namespace Tests\Unit;

use Tests\TestCase;

class AuthTest extends TestCase
{
    /**
     * Test a succesful login using GraphQL.
     *
     * @return void
     */
    public function testCanLoginWithGraphQL()
    {
        $this->createClient();
        $response = $this->post('/graphql', [
            'query' => "mutation{
              login(data: { username: \"admin@test.com\", password: \"password\"}) {
                access_token
              }
            }"
        ]);

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'data' => [
                'login' => [
                    'access_token',
                ]
            ]
        ]);
    }
}
