<?php

register_redis_queue_variables();

function get_platform_credentials(string $identifier): ?array
{
    $config = new \Platformsh\ConfigReader\Config();

    try {
        return $config->credentials($identifier);
    } catch (Exception $e) {
        return null;
    }
}

function set_platform_variables(string $identifier, array $mapping = []): void
{
    $credentials = get_platform_credentials($identifier);

    foreach ($mapping as $key => $variable) {
        putenv($variable . '=' . $credentials[$key]);
    }
}

function register_redis_queue_variables(): void
{
    $mapping = [
        'host' => 'REDIS_QUEUE_HOST',
        'port' => 'REDIS_QUEUE_PORT',
        'password' => 'REDIS_QUEUE_PASSWORD',
    ];

    set_platform_variables('redisqueue', $mapping);
}
