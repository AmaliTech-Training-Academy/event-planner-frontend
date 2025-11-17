import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  public pageTitle = signal<string>('Dashboard');

  public notificationsCount = signal<number>(0);
  public hasNotifications = () => this.notificationsCount() > 0;

  public userName = signal<string>('Jerome');
  public avatarSrc = signal<string>('icons/avatar.png');

  public logoSrc = signal<string>('icons/users-icon.png');
  public logoAlt = signal<string>('Logo');

  // Add sidebar collapsed state
  public sidebarCollapsed = signal<boolean>(false);

  public toggleSidebar(): void {
    this.sidebarCollapsed.update((value) => !value);
  }
}
