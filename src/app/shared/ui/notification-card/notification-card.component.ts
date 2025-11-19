import { Component, OnDestroy, OnInit, HostBinding } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import {
  Notification,
  NotificationType,
} from '../../../core/models/notifications.model';
import { Subscription } from 'rxjs';
import { NgClass } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-notification-card',
  imports: [NgClass, ButtonComponent],
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.scss',
})
export class NotificationCardComponent implements OnInit, OnDestroy {
  protected notification: Notification | null = null;
  protected isClosing = false;
  private subscription: Subscription = new Subscription();
  private autoCloseTimeout?: number;

  constructor(private readonly notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription.add(
      this.notificationService.notification$.subscribe((notification) => {
        this.isClosing = false;
        this.notification = notification;

        // Clear any existing timeout
        if (this.autoCloseTimeout) {
          clearTimeout(this.autoCloseTimeout);
        }

        // Auto-close after 5 seconds if notification exists
        if (notification) {
          this.autoCloseTimeout = window.setTimeout(() => {
            this.close();
          }, 5000);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.autoCloseTimeout) {
      clearTimeout(this.autoCloseTimeout);
    }
  }

  protected close() {
    // Trigger closing animation
    this.isClosing = true;

    // Wait for animation to complete before clearing notification
    setTimeout(() => {
      this.notificationService.clear();
      this.isClosing = false;
    }, 300); // Match the slideOutLeft animation duration
  }
}
