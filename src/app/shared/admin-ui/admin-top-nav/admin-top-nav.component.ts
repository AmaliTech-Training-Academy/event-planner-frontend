import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  signal,
  OnChanges,
  SimpleChanges,
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
export class AdminTopNavComponent implements OnChanges {
  @Input() public pageTitle = '';
  @Input() public notificationsCount = 0;
  @Input() public userName = '';
  @Input() public avatarSrc = '';
  @Input() public logoSrc = 'icons/users-icon.png';
  @Input() public logoAlt = 'Logo';

  private readonly _notifications = signal<number>(0);

  public readonly hasNotifications = computed(() => this._notifications() > 0);

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['notificationsCount']) {
      this._notifications.set(this.notificationsCount);
    }
  }
}
