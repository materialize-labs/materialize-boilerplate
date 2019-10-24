<?php

namespace App\Notifications\Tasks;

use App\Models\Task;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Str;

class TaskMoved extends Notification
{
    use Queueable;

    /**
     * @var \App\Models\Task
     */
    protected $task;

    /**
     * @var \App\Models\User
     */
    protected $user;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(Task $task, User $user)
    {
        $this->task = $task;
        $this->user = $user;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->line($this->getEmailLine())
                    ->action('Go to board', url('/matters/' . $this->task->matter_id))
                    ->line($this->getEmailLine());
    }

    /**
     * Get email line.
     *
     * @return string
     */
    protected function getEmailLine(): string
    {
        return Lang::get('notifications.tasks.task_moved', [
            'user_name' => $this->user->fullName,
            'task_title' => Str::limit($this->task->title, 50),
            'matter_title' => Str::limit($this->task->matter->title, 50),
            'status' => $this->task->status->name,
        ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
