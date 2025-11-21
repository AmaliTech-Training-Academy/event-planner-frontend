import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  OnChanges,
  SimpleChanges,
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
export class NotificationSettingsComponent implements OnChanges {
  @Input() public settings: NotificationSettings | null = null;
  @Output() public save: EventEmitter<UpdateNotificationSettingsPayload> = new EventEmitter<UpdateNotificationSettingsPayload>();

  protected readonly notifications = signal<NotificationItem[]>([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['settings']?.currentValue) {
      this._updateNotifications(changes['settings'].currentValue);
    }
  }

  protected toggleNotification(
    notificationId: keyof NotificationSettings
  ): void {
    this.notifications.update((current) =>
      current.map((n) =>
        n.id === notificationId ? { ...n, enabled: !n.enabled } : n
      )
    );
  }

  protected saveSettings(): void {
    const items = this.notifications();
    const payload: UpdateNotificationSettingsPayload = {
      eventCreation:
        items.find((n) => n.id === 'eventCreation')?.enabled ?? false,
      paymentFailures:
        items.find((n) => n.id === 'paymentFailures')?.enabled ?? false,
      platformErrors:
        items.find((n) => n.id === 'platformErrors')?.enabled ?? false,
    };

    this.save.emit(payload);
  }

  private _updateNotifications(settings: NotificationSettings): void {
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
        description: 'Receive notifications for payment processing failures',
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
}
