import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';

export interface MenuItem {
  readonly label: string;
  readonly iconPath: string;
  readonly route: string;
}

export interface MenuSection {
  readonly title?: string;
  readonly items: ReadonlyArray<MenuItem>;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSidebarComponent {
  private readonly _menuSections = signal<ReadonlyArray<MenuSection>>([
    {
      title: 'Dashboard',
      items: [
        {
          label: 'Overview',
          iconPath: 'icons/editor-icon.png',
          route: '/admin/overview',
        },
        {
          label: 'User Management',
          iconPath: 'icons/users-icon.png',
          route: '/admin/users',
        },
        {
          label: 'Saved Invites',
          iconPath: 'icons/save-icon.png',
          route: '/admin/invites',
        },
        {
          label: 'Event Overview',
          iconPath: 'icons/calender-icon.png',
          route: '/admin/events',
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
        {
          label: 'Reports',
          iconPath: 'icons/action-icon.png',
          route: '/admin/reports',
        },
      ],
    },
  ]);

  private readonly _settingsItem = signal<MenuItem>({
    label: 'Settings',
    iconPath: 'icons/settings-icon.png',
    route: '/admin/settings',
  });

  public readonly menuSections = computed(() => this._menuSections());
  public readonly settingsItem = computed(() => this._settingsItem());
}
