<?php
namespace App\Exceptions;

use GraphQL\Error\ClientAware;
use Throwable;

class GraphQLException extends \Exception implements ClientAware
{
    private $category;

    public function __construct($message = "", $category = 'LogicError', $code = 0, Throwable $previous = null)
    {
        $this->category = $category;
        parent::__construct($message, $code, $previous);
    }

    public function isClientSafe()
    {
        return true;
    }

    public function getCategory()
    {
        return $this->category;
    }
}
