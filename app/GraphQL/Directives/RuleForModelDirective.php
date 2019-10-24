<?php

namespace App\GraphQL\Directives;

use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Schema\Directives\RulesDirective;
use Nuwave\Lighthouse\Support\Contracts\ArgDirective;

class RuleForModelDirective extends RulesDirective implements ArgDirective
{
    /**
     * Name of the directive as used in the schema.
     *
     * @return string
     */
    public function name(): string
    {
        return 'ruleForModel';
    }

    /**
     * Return validation rules for this argument.
     *
     * @return array
     */
    public function rules(): array
    {
        $model = $this->directiveArgValue('model');
        $class = (class_exists($model)) ? $model : $this->namespaceModelClass($model);
        $fieldName = $this->definitionNode->name->value;
        $fullRules = $class::$rules;
        $path = $this->argumentPathAsDotNotation();
        if (!$fullRules) {
            return [$path => ''];
        }
        $rules = Arr::get($fullRules, $fieldName, [null]);
        if (is_array($rules)) {
            $rules = implode('|', $rules);
        }
        return [$path => $rules];
    }

    /**
     * @return string[]
     */
    public function messages(): array
    {
        return (new Collection($this->directiveArgValue('messages')))
            ->mapWithKeys(function (string $message, string $rule): array {
                $argumentPath = $this->argumentPathAsDotNotation();

                return ["{$argumentPath}.{$rule}" => $message];
            })
            ->all();
    }
}
