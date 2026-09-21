<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Enums\SignalementStatutEnum;
use App\Models\Signalement;
use Illuminate\Notifications\Notification;

final class SignalementStatusChanged extends Notification
{
    public function __construct(
        private readonly Signalement $signalement,
        private readonly SignalementStatutEnum $oldStatus,
        private readonly SignalementStatutEnum $newStatus,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'signalement.status_changed',
            'signalement_id' => $this->signalement->id,
            'old_status' => $this->oldStatus->value,
            'new_status' => $this->newStatus->value,
            'message' => sprintf(
                'Le signalement #%d est passé de %s à %s.',
                $this->signalement->id,
                $this->oldStatus->value,
                $this->newStatus->value,
            ),
        ];
    }
}
