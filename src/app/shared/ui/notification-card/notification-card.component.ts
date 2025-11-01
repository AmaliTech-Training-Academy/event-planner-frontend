import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification, NotificationType } from '../../../core/models/notifications.model';
import { Subscription } from 'rxjs';
import { NgClass } from '@angular/common';
import { ButtonComponent } from "../button/button.component";
@Component({
  selector: 'app-notification-card',
  imports: [NgClass, ButtonComponent],
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.scss'
})
export class NotificationCardComponent implements OnInit, OnDestroy {
  protected notification: Notification | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private readonly notificationService: NotificationService) { }

  ngOnInit() {
    this.subscription.add(
      this.notificationService.notification$.subscribe(
        (notification) => (this.notification = notification)
      )
    )
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected close() {
    this.notificationService.clear();
  }

}
