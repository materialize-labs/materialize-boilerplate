<?php

namespace App\Helpers;

class Helper
{
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
     * Get an array of class names from a given directory.
     *
     * @param  string $dir
     * @param  array  $excludedDirectories String or array of directories to exclude
     * @param  string $type
     * @return array
     */
    public static function getClasses($dir, $excludedDirectories = [], $type = null) : array
    {
        $path = app_path().$dir;
        $fqcns = array();

        $allFiles = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($path));
        $phpFiles = new \RegexIterator($allFiles, '/\.php$/');
        if (!blank($excludedDirectories)) {
            $phpFiles = new \CallbackFilterIterator(
                $phpFiles,
                function ($file) use ($dir, $excludedDirectories) {
                    $escapedDir = str_replace('/', '\/', $dir);
                    $exclude = implode('|', $excludedDirectories);
                    $regex = "/{$escapedDir}.*({$exclude})\/?/";
                    $result = \Safe\preg_match($regex, $file->getPath());
                    return !$result;
                }
            );
        }
        foreach ($phpFiles as $phpFile) {
            $content = file_get_contents($phpFile->getRealPath());
            $tokens = token_get_all($content);
            $namespace = '';
            for ($index = 0; isset($tokens[$index]); $index++) {
                if (!isset($tokens[$index][0])) {
                    continue;
                }
                if (T_NAMESPACE === $tokens[$index][0]) {
                    $index += 2; // Skip namespace keyword and whitespace
                    while (isset($tokens[$index]) && is_array($tokens[$index])) {
                        $namespace .= $tokens[$index++][1];
                    }
                }
                if (T_CLASS === $tokens[$index][0]
                        && T_WHITESPACE === $tokens[$index + 1][0]
                        && T_STRING === $tokens[$index + 2][0]) {
                    $index += 2; // Skip class keyword and whitespace

                    if ($type === 'configurator') {
                        $namespace = str_replace('App', "App\\", $namespace);
                        $fqcns[] = $namespace.'\\\\'.$tokens[$index][1];
                    } else {
                        $fqcns[] = $namespace.'\\'.$tokens[$index][1];
                    }

                    # break if you have one class per file (psr-4 compliant)
                    # otherwise you'll need to handle class constants (Foo::class)
                    break;
                }
            }
        }

        return $fqcns;
    }
}
