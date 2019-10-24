<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Helpers\Helper;

class SearchDelete extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'search:delete';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete all ElasticSearch indexes.';

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
        $this->line('Dropping all indexes...');

        $errors = [];
        $success = [];
        foreach (Helper::getClasses('/ESConfigurators', ['Policies'], 'configurator') as $index => $className) {
            // $this->comment("\n Deleting {$className}");
            try {
                \Artisan::call("elastic:drop-index {$className}");
                $success[] = $className;
            } catch (\Elasticsearch\Common\Exceptions\Missing404Exception $e) {
                $errors[] = $className;
            }
        }

        if (count($errors)) {
            $this->comment('The following indexes could not be dropped because they do not exist:');
            foreach ($errors as $class) {
                $this->error($class);
            }
        }

        if (count($success)) {
            $this->comment('The following indexes were dropped:');
            foreach ($success as $class) {
                $this->info($class);
            }
        }

        return;
    }
}
