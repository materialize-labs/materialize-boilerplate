<?php

namespace Tests;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Passport\Passport;
use Laravel\Passport\ClientRepository;
use Laravel\Passport\PassportServiceProvider;
use Mockery;
use Orchestra\Testbench\TestCase as Orchestra;
use Nuwave\Lighthouse\LighthouseServiceProvider;
use Joselfonseca\LighthouseGraphQLPassport\Providers\LighthouseGraphQLPassportServiceProvider;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication, RefreshDatabase;

    protected $keys = [];


    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan("db:seed");
    }

    /**
     * Create a passport client for testing
     */
    public function createClient()
    {
        //$this->artisan('migrate', ['--database' => 'testbench']);
        Passport::loadKeysFrom(__DIR__ . '/storage/');
        $client = app(ClientRepository::class)->createPasswordGrantClient(null, 'test', 'http://localhost');
        config()->set('lighthouse-graphql-passport.client_id', $client->id);
        config()->set('lighthouse-graphql-passport.client_secret', $client->secret);
    }
    /**
     * Create a passport client for testing
     */
    public function createClientPersonal($user)
    {
        Passport::loadKeysFrom(__DIR__ . '/storage/');
        $client = app(ClientRepository::class)->createPersonalAccessClient($user->id, 'test', 'http://localhost');
        config()->set('lighthouse-graphql-passport.client_id', $client->id);
        config()->set('lighthouse-graphql-passport.client_secret', $client->secret);
    }

    public function getLoginTokenForUser($email = 'admin@test.com', $password = 'password')
    {
        $checksum = crc32("{$email}{$password}");
        $key = base_convert($checksum, 10, 36);
        if (isset($this->keys[$key])) {
            return $this->keys[$key];
        }

        $this->createClient();
        $mutation = [
            'query' => "mutation {
                login(data: { username: \"{$email}\", password: \"{$password}\"}) {
                    access_token
                }
            }"
        ];

        $response = $this->post('/graphql', $mutation);

        $response->assertStatus(200);

        $responseBody = json_decode($response->getContent(), true);
        $token = $responseBody['data']['login']['access_token'];
        $this->keys[$key] = $token;
        return $token;
    }

    /**
     * Mock Scout call for update.
     *
     * @return void
     */
    public function mockScoutUpdate(int $times = 1): void
    {
        $this->mock(
            \Laravel\Scout\EngineManager::class,
            function ($mock) use ($times) {
                $fakeEngine = Mockery::mock(
                    \Laravel\Scout\Engines\Engine::class,
                    function ($mock) use ($times) {
                        $mock->shouldReceive('update')->times($times);
                    }
                );
                $mock->shouldReceive('engine')->times($times)->andReturn($fakeEngine);
            }
        );
    }

    /**
     * Mock Scout call for delete.
     *
     * @return void
     */
    public function mockScoutDelete(int $times = 1): void
    {
        $this->mock(
            \Laravel\Scout\EngineManager::class,
            function ($mock) use ($times) {
                $fakeEngine = Mockery::mock(
                    \Laravel\Scout\Engines\Engine::class,
                    function ($mock) use ($times) {
                        $mock->shouldReceive('delete')->times($times);
                    }
                );
                $mock->shouldReceive('engine')->times($times)->andReturn($fakeEngine);
            }
        );
    }
}
