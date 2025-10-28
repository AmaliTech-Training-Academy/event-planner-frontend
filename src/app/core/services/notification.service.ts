import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../models/notifications.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  private notifications = new BehaviorSubject<Notification | null>(null);
  public notification$ = this.notifications.asObservable();

  private show(notification: Notification) {
    this.notifications.next(notification);
    if (notification.duration) {
      setTimeout(() => this.clear(), notification.duration);
    }
  }

  public success(message: string, duration = 3000) {
    this.show({ type: 'success', message, duration });
  }

  public error(message: string, duration = 4000) {
    this.show({ type: 'error', message, duration });
  }

  public info(message: string, duration = 3000) {
    this.show({ type: 'info', message, duration });
  }

  public warning(message: string, duration = 4000) {
    this.show({ type: 'warning', message, duration });
  }

  public clear() {
    this.notifications.next(null);
  }
}
