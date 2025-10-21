import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-top-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-top-nav.component.html',
  styleUrls: ['./admin-top-nav.component.scss'],
})
export class AdminTopNavComponent {
  @Input() pageTitle!: string;
  @Input() notificationsCount: number = 0;
  @Input() userName!: string;
  @Input() avatarSrc!: string;
  @Input() logoSrc: string = 'icons/users-icon.png';
  @Input() logoAlt: string = 'Logo';

  hasNotifications = computed(() => this.notificationsCount > 0);
}
