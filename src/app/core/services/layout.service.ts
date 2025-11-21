import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly platformId = inject(PLATFORM_ID);

  public pageTitle = signal<string>('Dashboard');
  public notificationsCount = signal<number>(0);
  public hasNotifications = () => this.notificationsCount() > 0;

  public userName = signal<string>('Sule Malik');
  public avatarSrc = signal<string>('icons/avatar.png');

  public logoSrc = signal<string>('icons/users-icon.png');
  public logoAlt = signal<string>('Logo');

  public sidebarCollapsed = signal<boolean>(false);
  public isMobile = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initResizeListener();
    }
  }

  private initResizeListener(): void {
    this.checkWidth();

    window.addEventListener('resize', () => {
      this.checkWidth();
    });
  }

  private checkWidth(): void {
    const width = window.innerWidth;
    const mobile = width <= 768;

    this.isMobile.set(mobile);

    // Auto-collapse on mobile
    if (mobile) {
      this.sidebarCollapsed.set(true);
    }
  }

  public toggleSidebar(): void {
    this.sidebarCollapsed.update((value) => !value);
  }
}
