<?php

namespace App\Listeners\Notifications\Tasks;

use App\Events\Tasks\TaskMoved;
use App\Models\Task;
use App\Notifications\Tasks\TaskMoved as TaskMovedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class NotifyTaskHasMoved implements ShouldQueue
{
    /**
     * Queue name.
     *
     * @var string
     */
    protected $queue = 'notifications';

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  TaskMoved  $event
     * @return void
     */
    public function handle(TaskMoved $event)
    {
        // Send notifications
        $this->gatherRecipients($event->task)
            ->each(function ($user) use ($event) {
                $user->notify(new TaskMovedNotification($event->task, $event->user));
            });
    }

    /**
     * Gather recipients for this notification.
     *
     * @param  Task   $task
     * @return \Illuminate\Support\Collection
     */
    protected function gatherRecipients(Task $task): \Illuminate\Support\Collection
    {
        return $task->users()
            ->with('user')
            ->get()
            ->pluck('user');
    }
}
