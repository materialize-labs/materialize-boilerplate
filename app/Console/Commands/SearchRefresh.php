<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Helpers\Helper;

class SearchRefresh extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'search:refresh';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete, create, and import all ElasticSearch indexes and models.';

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
        $this->line('Recreating all indexes from ElasticSearch configurators...');
        $indexRes  = $this->refreshIndexes();
        $this->comment('Done!');

        $this->line('Importing all records...');
        $importRes = $this->importRecords();
        $this->comment('Done!');

        return;
    }

    private function refreshIndexes()
    {
        $classes = Helper::getClasses('/ESConfigurators', ['Policies'], 'configurator');
        $errors = [];
        $success = [];
        foreach ($classes as $index => $className) {
            try {
                \Artisan::call("elastic:drop-index {$className}");
                $success[] = $className;
            } catch (\Elasticsearch\Common\Exceptions\Missing404Exception $e) {
                $errors[] = $className;
            }

            try {
                \Artisan::call("elastic:create-index {$className}");
                $success[] = $className;
            } catch (\Elasticsearch\Common\Exceptions\BadRequest400Exception $e) {
                $errors[] = $className;
            }
        }

        return [
            'errors'  => $errors,
            'success' => $success,
        ];
    }

    private function importRecords()
    {
        $errors = [];
        $success = [];
        foreach (Helper::getClasses('/Models', ['Policies']) as $index => $className) {
            $classUses = class_uses($className);

            // Skip this class if the ElasticSearch trait isn't found
            if (!count($classUses) || !array_key_exists('App\Traits\Searchable', $classUses)) {
                continue;
            }

            $className = str_replace("\\", "\\\\", $className);

            try {
                \Artisan::call("scout:flush {$className}");
                $success[] = $className;
            } catch (\Exception $e) {
                $errors[] = $className;
            }

            try {
                \Artisan::call("scout:import {$className}");
                $success[] = $className;
            } catch (\Exception $e) {
                $errors[] = $className;
            }
        }

        return [
            'errors'  => $errors,
            'success' => $success,
        ];
    }
}
