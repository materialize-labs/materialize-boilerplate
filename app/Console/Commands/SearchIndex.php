<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Helpers\Helper;

class SearchIndex extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'search:index';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Index all ElasticSearch configurators.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->line('Indexing all configurators...');

        $errors = [];
        $success = [];
        foreach (Helper::getClasses('/ESConfigurators', ['Policies'], 'configurator') as $index => $className) {
            // $this->comment("\n Deleting {$className}");
            try {
                \Artisan::call("elastic:create-index {$className}");
                $success[] = $className;
            } catch (\Elasticsearch\Common\Exceptions\BadRequest400Exception $e) {
                $errors[] = $className;
            }
        }

        if (count($errors)) {
            $this->comment('The following indexes could not be created because they already exist:');
            foreach ($errors as $class) {
                $this->error($class);
            }
        }

        if (count($success)) {
            $this->comment('The following indexes have been created:');
            foreach ($success as $class) {
                $this->info($class);
            }
        }

        return;
    }
}
