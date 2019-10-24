<?php

namespace Tests\Feature;

use Tests\TestCase;

class UserTest extends TestCase
{

    /**
     * Test if users can be queried.
     *
     * @return void
     */
    public function testCanGetUsers()
    {
        $response = $this->post('/graphql', [
            'query' => "{
              users {
                id
                first_name
                last_name
                email
                phone
              }
            }"
        ]);

        $response
            ->assertStatus(200)
            ->assertJson($this->getUsersResponse());
    }

    /**
     * Test if user can be udpated.
     *
     * @return void
     */
    public function testCanUpdateUser()
    {
        $token = $this->getLoginTokenForUser();

        $this->mockScoutUpdate(1);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])
        ->json('POST', '/graphql', [
            'query' => "mutation {
              updateUser(id: 1, first_name: \"Changed Name\") {
                id
                email
                first_name
              }
            }"
        ]);

        $response
            ->assertStatus(200)
            ->assertJson($this->updateUsersResponse());
    }

    public function testCanGetCurrentUser()
    {
        $token = $this->getLoginTokenForUser();

        $query = [
            'query' => "{
                    me {
                      id
                    first_name
                    last_name
                    email
                    phone
                }
            }"
        ];

        $response = $this->json('POST', '/graphql', $query);
        $response
            ->assertStatus(200)
            ->assertJson([
                "data" => [
                    "me" => null
                ]
            ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])
            ->json('POST', '/graphql', $query);

        $response
            ->assertStatus(200)
            ->assertJson($this->getCurrentUserResponse());
    }

    public function testCanRegister()
    {
        $this->createClient();
        $mutation = [
            'query' => "mutation {
                newUser(data: {
                    first_name: \"Add\"
                    last_name: \"User\"
                    email: \"test@adduser.com\"
                    phone: \"3105555555\"
                    password: \"password\"
                 }){
                    access_token
                }
            }"
        ];

        $this->mockScoutUpdate(1);

        $response = $this->post('/graphql', $mutation);

        $response->assertStatus(200);

        $responseBody = json_decode($response->getContent(), true);
        // dd($responseBody);
        $this->assertArrayHasKey('newUser', $responseBody['data']);
        $this->assertArrayHasKey('access_token', $responseBody['data']['newUser']);
    }

    public function testCanInviteUser()
    {
        $this->createClient();
        $token = $this->getLoginTokenForUser();
        $mutation = [
            'query' => "mutation {
                inviteUser(data: {
                    first_name: \"Invite\"
                    last_name: \"User\"
                    email: \"invite@gmail.com\"
                    title: \"Assistant\"
                    password: \"password\"
                }){
                    status
                    message
                }
            }"
        ];

        $this->mockScoutUpdate(1);

        $response = $this->json('POST', '/graphql', $mutation);

        $response->assertStatus(200);

        $this->assertEquals(
            $response->original['errors'][0]['message'],
            'You are not authorized to access inviteUser'
        );

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])
            ->json('POST', '/graphql', $mutation);

        $response->assertStatus(200);

        $responseBody = json_decode($response->getContent(), true);

        $response
            ->assertStatus(200)
            ->assertJson([
                'data' => [
                    'inviteUser' => [
                        'status' => 'success',
                        'message' => 'User has been invited.',
                    ]
                ]
            ]);
    }

    public function testCanDeleteUser()
    {
        $this->createClient();
        $token = $this->getLoginTokenForUser();
        $mutation = [
            'query' => "mutation {
                deleteUser(id: \"1\") {
                    id
                }
            }"
        ];

        $this->mockScoutDelete(1);

        $response = $this->json('POST', '/graphql', $mutation);

        $response->assertStatus(200);
        $this->assertEquals(
            $response->original['errors'][0]['debugMessage'],
            'Unauthenticated.'
        );

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])
            ->json('POST', '/graphql', $mutation);

        $response->assertStatus(200);

        $response
            ->assertStatus(200)
            ->assertJson([
                'data' => [
                    'deleteUser' => [
                        'id' => '1',
                    ]
                ]
            ]);
    }

    public function testCanChangePassword()
    {
        $this->createClient();
        $token = $this->getLoginTokenForUser();
        $mutation = [
            'query' => "mutation {
                changePassword(data: {
                    id: \"1\"
                    password: \"password1\"
                }){
                    id
                    first_name
                }
            }"
        ];

        $this->mockScoutUpdate(1);

        $response = $this->json('POST', '/graphql', $mutation);

        $response->assertStatus(200);
        $this->assertEquals(
            $response->original['errors'][0]['debugMessage'],
            'You are not authenticated'
        );

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])
            ->json('POST', '/graphql', $mutation);

        $response->assertStatus(200);

        $responseBody = json_decode($response->getContent(), true);

        $response
            ->assertStatus(200)
            ->assertJson([
                'data' => [
                    'changePassword' => [
                        'id' => '1',
                        'first_name' => 'Testy',
                    ]
                ]
            ]);
    }

    private function getUsersResponse()
    {
        return [
          "data" => [
            "users" => [
              [
                "id" => 1,
                "first_name" => "Testy",
                "last_name" => "McTesterson",
                "email" => "admin@test.com",
                "phone" => "+13104599863",
              ]
            ]
          ]
        ];
    }

    private function updateUsersResponse()
    {
        return [
          "data" => [
            "updateUser" => [
                "id" => 1,
                "email" => "admin@test.com",
                "first_name" => "Changed Name",
            ]
          ]
        ];
    }

    private function getCurrentUserResponse()
    {
        return [
            "data" => [
                "me" => [
                    "id" => 1,
                    "first_name" => "Testy",
                    "last_name" => "McTesterson",
                    "email" => "admin@test.com",
                    "phone" => "+13104599863",
                ]
            ]
        ];
    }

    private function registerUserResponse()
    {
        return [
            "data" => [
                "newUser" => [
                    "id" => 4,
                ]
            ]
        ];
    }
}
