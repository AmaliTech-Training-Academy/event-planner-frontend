import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LayoutService } from '../../../core/services/layout.service';
import { AuthService } from '../../../core/services/auth.service';
import { LogoutConfirmationModalComponent } from "../../components/logout-confirmation-modal/logout-confirmation-modal.component";

export interface MenuItem {
  readonly label: string;
  readonly iconPath: string;
  readonly route?: string;
  readonly action?: () => void;
  readonly isLogout?: boolean;
}

export interface MenuSection {
  readonly title?: string;
  readonly items: ReadonlyArray<MenuItem>;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage, LogoutConfirmationModalComponent],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSidebarComponent {
  private readonly layoutService = inject(LayoutService);
  private readonly authService = inject(AuthService);
  protected showLogoutModal = signal(false);

  protected readonly isCollapsed = this.layoutService.sidebarCollapsed;

  private readonly _menuSections = signal<ReadonlyArray<MenuSection>>([
    {
      title: 'Dashboard',
      items: [
        {
          label: 'Overview',
          iconPath: 'icons/editor-icon.png',
          route: '/admin',
        },
        {
          label: 'User Management',
          iconPath: 'icons/users-icon.png',
          route: '/admin/users',
        },
        {
          label: 'Event Overview',
          iconPath: 'icons/calender-icon.png',
          route: '/admin/events',
        },
        {
          label: 'Audit Logs',
          iconPath: 'icons/audit.png',
          route: '/admin/audit-logs',
        },
      ],
    },
    {
      title: 'Payment',
      items: [
        {
          label: 'Transactions',
          iconPath: 'icons/social-icon.png',
          route: '/admin/transactions',
        },
       
      ],
    },
  ]);

  private readonly _settingsItem = signal<MenuItem>({
    label: 'Settings',
    iconPath: 'icons/settings-icon.png',
    route: '/admin/settings',
  });

  private readonly _logoutItem = signal<MenuItem>({
    label: 'Logout',
    iconPath: 'icons/logout.png',
    isLogout: true,
    action: () => this.handleLogout(),
  });

  public readonly menuSections = computed(() => this._menuSections());
  public readonly settingsItem = computed(() => this._settingsItem());
  public readonly logoutItem = computed(() => this._logoutItem());

  protected toggleSidebar(): void {
    this.layoutService.toggleSidebar();
  }

  protected handleLogout(): void {
    // Show modal instead of logging out directly
    this.showLogoutModal.set(true);
  }

  protected onLogoutConfirm(): void {
    this.showLogoutModal.set(false);
    this.authService.adminLogout().subscribe();
  }

  protected onLogoutCancel(): void {
    this.showLogoutModal.set(false);
  }
  protected handleItemClick(item: MenuItem, event: Event): void {
    if (item.isLogout) {
      event.preventDefault();
      item.action?.();
    }
  }
}
