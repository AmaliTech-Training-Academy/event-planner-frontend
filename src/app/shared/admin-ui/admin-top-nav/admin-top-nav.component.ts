import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  signal,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-admin-top-nav',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './admin-top-nav.component.html',
  styleUrls: ['./admin-top-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTopNavComponent {
  @Input() public pageTitle = '';
  @Input() public notificationsCount = 0;
  @Input() public userName = '';
  @Input() public avatarSrc = '';
  @Input() public logoSrc = 'icons/users-icon.png';
  @Input() public logoAlt = 'Logo';

  private readonly _notifications = signal(0);

  public ngOnChanges(): void {
    this._notifications.set(this.notificationsCount);
  }

  public readonly hasNotifications = computed(() => this._notifications() > 0);
}
