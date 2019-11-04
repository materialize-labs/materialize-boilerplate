<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Helpers\Helper;

class SearchFlush extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'search:flush';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Flush records all records from ElasticSearch.';

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
        $this->line('Importing all models...');

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
        }

        if (count($errors)) {
            $this->comment('The following models could not be flushed:');
            foreach ($errors as $class) {
                $this->error($class);
            }
            $this->comment('Do the ElasticSearch indexes exist?');
        }

        if (count($success)) {
            $this->comment('The following models have been flushed:');
            foreach ($success as $class) {
                $this->info($class);
            }
        }

        return;
    }
}
