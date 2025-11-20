import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@app/shared/ui/button/button.component';
import {
  NotificationSettings,
  UpdateNotificationSettingsPayload,
} from '@app/core/models/platform-settings.model';

interface NotificationItem {
  id: keyof NotificationSettings;
  title: string;
  description: string;
  enabled: boolean;
}

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss'],
})
export class NotificationSettingsComponent {
  @Input() settings: NotificationSettings | null = null;
  @Output() save = new EventEmitter<UpdateNotificationSettingsPayload>();

  protected readonly notifications = signal<NotificationItem[]>([]);

  constructor() {
    // Update notifications when input changes
    effect(() => {
      const settings = this.settings;
      if (settings) {
        this.notifications.set([
          {
            id: 'eventCreation',
            title: 'Event Creation Notifications',
            description: 'Receive notifications when new events are created',
            enabled: settings.eventCreation,
          },
          {
            id: 'paymentFailures',
            title: 'Payment Failure Notifications',
            description:
              'Receive notifications for payment processing failures',
            enabled: settings.paymentFailures,
          },
          {
            id: 'platformErrors',
            title: 'Platform Error Notifications',
            description: 'Receive notifications for system errors and issues',
            enabled: settings.platformErrors,
          },
        ]);
      }
    });
  }

  protected toggleNotification(
    notificationId: keyof NotificationSettings
  ): void {
    const updated = this.notifications().map((notification) =>
      notification.id === notificationId
        ? { ...notification, enabled: !notification.enabled }
        : notification
    );
    this.notifications.set(updated);
  }

  protected saveSettings(): void {
    const currentNotifications = this.notifications();
    const payload: UpdateNotificationSettingsPayload = {
      eventCreation:
        currentNotifications.find((n) => n.id === 'eventCreation')?.enabled ||
        false,
      paymentFailures:
        currentNotifications.find((n) => n.id === 'paymentFailures')?.enabled ||
        false,
      platformErrors:
        currentNotifications.find((n) => n.id === 'platformErrors')?.enabled ||
        false,
    };

    // Emit the save event to parent
    this.save.emit(payload);
  }
}
