<a href="https://materializelabs.com">
	<img src="https://d1vqe4bnlv6mwq.cloudfront.net/horizontal-logo.png" alt="Materialize Labs" width="400"/>
</a>

# Materialize Boilerplate

## About the Project

A Laravel built, GraphQL driven, React SPA starter project. Preconfigured for deploying to Platform.sh.

See the [wiki](https://github.com/materialize-labs/materialize-boilerplate/wiki) for detailed documentation.

#### Services, Libraries, and Frameworks
* Pre-configured Docker containers
* Laravel 6
* React 16
* GraphQL API
* ElasticSearch
* Redis cache
* Automatic code linting and testing
* Preconfigured Platform.sh config files

#### Out-of-the-box Functionality
* Passport OAuth Authentication
* Google Social Auth
* PHPUnit feature and unit tests
* Laravel Scout searching w/ ElasticSearch support
* Opinionated ESLint rules
* Opinionated phpcbf rules
* Git hooks to run test and linting suite automatically

#### Laravel Packages
* [Lighthouse](https://lighthouse-php.com/) GraphQL server
* [Laravel Passport](https://laravel.com/docs/5.8/passport) authentication
* [Lighthouse/Passport Auth](https://github.com/joselfonseca/lighthouse-graphql-passport-auth)
* [Laravel Socialite](https://laravel.com/docs/5.8/socialite) social login
* [Laravel Scout](https://laravel.com/docs/5.8/scout) full-text search
* [Scout ElasticSearch Driver](https://github.com/babenkoivan/scout-elasticsearch-driver)
* [Spatie Activity Log](https://github.com/spatie/laravel-activitylog)
* [Spatie Roles/Permissions](https://github.com/spatie/laravel-permission)

#### React Packages
* [Apollo](https://github.com/apollographql/react-apollo) GraphQL client
* [CoreUI](https://coreui.io/react/) interface
* [ESLint](https://eslint.org/) JS linting
* [SASS](https://sass-lang.com/) CSS preprocessor
* [Formik](https://github.com/jaredpalmer/formik) form builder
* [Yup](https://github.com/jquense/yup) form validation

#### Cloud Host Provider
* [Platform.sh](https://platform.sh/) Automated Cloud Host

## Host Machine Requirements
* PHP 7.2>
* [Node](https://nodejs.org/en/download/)
* [NVM](https://github.com/nvm-sh/nvm)
* [Composer](https://getcomposer.org/)
* [Docker](https://www.docker.com/products/docker-desktop)

## Installation

For detailed Laravel setup instructions, visit [their documentation](https://laravel.com/docs/6.x).

1. **Clone the repo**
   
   ```sh
   $ git clone git@github.com:materialize-labs/materialize-boilerplate.git
   ```
2. **Copy the Docker example .env**
   
   ```sh
   $ cp docker/env-example docker/.env
   ```
3. **Copy project example .env file**
   
   ```sh
   $ cp .env.example .env
   ```
4. **Start Docker containers**
      * PHP 7.2
      * MySQL 5.7
      * nginx
      * Redis
      * ElasticSearch
      * Kibana
   ```sh
   $ bash dkr up
   ```

5. **Install PHP dependencies**

   ```sh
   $ composer install
   ```

6. **Generate application key**
   
   ```sh
   $ php artisan key:generate
   ```

7. **Create MySQL DB**

a. Enter the MySQL container:

```sh
cd docker && docker-compose exec mysql bash
```

b. Enter MySQL:

```sh
mysql -uroot -proot
```

c. Create new DB:

```sh
CREATE DATABASE materialize;
```

d. Exit MySQL and exit the container.

***NOTE***:
If you have problems like `connection refused` in the next steps, this is related to MySQL 8 and you can check [this link](https://medium.com/@crmcmullen/how-to-run-mysql-8-0-with-native-password-authentication-502de5bac661) to understand the problem.

You can solve it by doing:

a. Get in your container for mysql:
   
   ``` sh
   docker exec -it laradock_workspace_1 bash
   ```

b. Create or update your password with the mysq_native_password:
   
   ```SH
   CREATE USER 'nativeuser'@'%'IDENTIFIED WITH mysql_native_password BY 'password';
   ```

8. **Run migrations and seed DB**
   ```sh
   $ php artisan migrate
   $ php artisan db:seed
   ```

9. **Install Passport authentication**

   ```sh
   $ php artisan passport:install
   ```

10. **Create ElasticSearch indexes and import records**

   ```sh
   $ php artisan search:refresh

   ```
11. **Set Passport env variables**
    ```
    PASSPORT_CLIENT_ID=
    PASSPORT_CLIENT_SECRET=
    ```

Set the values using the `id` and `secret` values that are set in the `oauth_clients` table on the generated record with `name` "Materialize Boilerplate Password Grant Client".

12. **Set env variables for mail client**
    ```
    MAIL_DRIVER=smtp
    MAIL_HOST=smtp.mailtrap.io
    MAIL_PORT=2525
    MAIL_USERNAME=[your username]
    MAIL_PASSWORD=[your password]
    MAIL_ENCRYPTION=TLS
    ```

13. **Set env variables for Google social authentication**

[This article](https://medium.com/employbl/add-login-with-google-to-your-laravel-app-d2205f01b895) explains how to get Client and Secret keys from Google.

    ```
    GOOGLE_CLIENT_ID=ID_FROM_GOOGLE
    GOOGLE_CLIENT_SECRET=SECRET_FROM_GOOGLE
    GOOGLE_REDIRECT_URI="http://localhost/google/callback"
    ```

14. **Use the Node version provided by .nvmrc**

   ```sh
   nvm use
   ```

15. **Install frontend dependencies**
   
   ```sh
   $ npm i
   ```
16. **Compile frontend assets**

   ```sh
   $ npm run prod
   ```
17. **Run website**

    `http://localhost/`

18. **Login**

Use a seeded user account to login:

**Email**: admin@test.com<br>
**Password**: password

## Docker

**docker-compose shortcuts**

Spin up the containers (MySQL, redis, ElasticSearch, nginx, kibana)
```sh
$ bash dkr up
```

Stop the containers
```sh
$ bash dkr stop
```

Clear the container logs
```sh
$ bash dkr truncate-logs
```

## Deploying

Read the documentation at [platform.sh](https://docs.platform.sh/) for more info.

## Useful commands

**Compile assets for development and watch for changes**
```sh
$ npm run hot
```

**Run backend and frontend tests**
```sh
$ npm run test
```

**Run linters**
```sh
$ npm run lint
```

## Example API Requests

**Get list of users**
```
GET /graphql?query=query+FetchUsers{users{id,email}}
```
