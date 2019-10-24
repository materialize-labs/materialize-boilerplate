<?php

namespace App\Traits;

use ArrayAccess;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

trait SortableTrait
{
    public static function bootSortableTrait()
    {
        static::creating(function ($model) {
            if ($model->shouldSortWhenCreating()) {
                $model->setHighestOrderNumber();
            }
        });
    }

    public function setHighestOrderNumber()
    {
        $orderColumnName = $this->determineOrderColumnName();

        $this->$orderColumnName = $this->getHighestOrderNumber() + 1;
    }

    public function getHighestOrderNumber(): int
    {
        return (int) $this->buildSortQuery()->max($this->determineOrderColumnName());
    }

    public function scopeOrdered(Builder $query)
    {
        return $query->orderBy($this->determineOrderColumnName());
    }

    public static function setNewOrder($ids, int $startOrder = 1, string $primaryKeyColumn = null)
    {
        if (! is_array($ids) && ! $ids instanceof ArrayAccess) {
            throw new InvalidArgumentException('You must pass an array or ArrayAccess object to setNewOrder');
        }

        $model = new static;

        $orderColumnName = $model->determineOrderColumnName();

        if (is_null($primaryKeyColumn)) {
            $primaryKeyColumn = $model->getKeyName();
        }

        foreach ($ids as $id) {
            static::withoutGlobalScope(SoftDeletingScope::class)
                ->where($primaryKeyColumn, $id)
                ->update([$orderColumnName => $startOrder++]);
        }
    }

    public static function setNewOrderByCustomColumn(string $primaryKeyColumn, $ids, int $startOrder = 1)
    {
        self::setNewOrder($ids, $startOrder, $primaryKeyColumn);
    }

    protected function determineOrderColumnName(): string
    {
        if (isset($this->sortable['order_column_name']) &&
            ! empty($this->sortable['order_column_name'])) {
            return $this->sortable['order_column_name'];
        }

        return 'order_column';
    }

    /**
     * Determine if the order column should be set when saving a new model instance.
     */
    public function shouldSortWhenCreating(): bool
    {
        return $this->sortable['sort_when_creating'] ?? true;
    }

    public function buildSortQuery()
    {
        return static::query();
    }

    /**
     * Move model to new position.
     *
     * @param  int    $newPosition
     * @return $this
     */
    public function moveTo(int $newPosition): self
    {
        $orderColumnName = $this->determineOrderColumnName();
        $currentPosition = $this->getAttribute($orderColumnName);

        // Same position - do nothing
        if ($newPosition === $currentPosition) {
            return $this;
        }

        DB::transaction(function () use ($orderColumnName, $currentPosition, $newPosition) {
            // Check if new position is taken
            $taken = $this->buildSortQuery()->where($orderColumnName, $newPosition)->first() !== null;

            // Move other items to take new position
            if ($taken) {
                if ($newPosition > $currentPosition) {
                    // Going down
                    $this->getSortGoingDownQuery($orderColumnName, $currentPosition, $newPosition)
                        ->update([
                            $orderColumnName => DB::raw($orderColumnName . '-1'),
                        ]);
                } else {
                    // Going up
                    $this->getSortGoingUpQuery($orderColumnName, $currentPosition, $newPosition)
                        ->update([
                            $orderColumnName => DB::raw($orderColumnName . '+1'),
                        ]);
                }
            }

            // Set desired position
            $this->setAttribute($orderColumnName, $newPosition);
            $this->save();
        });

        return $this;
    }

    /**
     * Takes a position out and re-sorts.
     *
     * @param  int    $position
     * @return $this
     */
    public function moveOut(int $position): self
    {
        $orderColumnName = $this->determineOrderColumnName();

        $this->buildSortQuery()
            ->ordered()
            ->where($orderColumnName, '>', $position)
            ->update([
                $orderColumnName => DB::raw($orderColumnName.'-1'),
            ]);

        return $this;
    }

    /**
     * Get query of items when new position is higher than current position.
     *
     * @param  string $orderColumnName
     * @param  int    $currentPosition
     * @param  int    $newPosition
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function getSortGoingDownQuery(string $orderColumnName, int $currentPosition, int $newPosition): Builder
    {
        return $this->buildSortQuery()
            ->ordered()
            ->where($orderColumnName, '>', $currentPosition)
            ->where($orderColumnName, '<=', $newPosition);
    }

    /**
     * Get query of items when new position is lower than current position.
     *
     * @param  string $orderColumnName
     * @param  int    $currentPosition
     * @param  int    $newPosition
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function getSortGoingUpQuery(string $orderColumnName, int $currentPosition, int $newPosition): Builder
    {
        return $this->buildSortQuery()
            ->ordered('desc')
            ->where($orderColumnName, '>=', $newPosition)
            ->where($orderColumnName, '<', $currentPosition);
    }
}
