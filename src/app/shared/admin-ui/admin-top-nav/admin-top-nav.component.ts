import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  signal,
  OnChanges,
  SimpleChanges,
  WritableSignal,
  Signal,
  inject,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from "../../ui/button/button.component";
import { AuthService } from '../../../core/services/auth.service';
import { APP_ROUTES } from '../../../core/constants/app-routes.constants';

@Component({
  selector: 'app-admin-top-nav',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink, ButtonComponent],
  templateUrl: './admin-top-nav.component.html',
  styleUrls: ['./admin-top-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTopNavComponent implements OnChanges {
  private readonly _authService: AuthService = inject(AuthService);
  protected readonly APP_ROUTES = APP_ROUTES;

  @Input() public pageTitle = '';
  @Input() public notificationsCount = 0;
  @Input() public userName = '';
  @Input() public avatarSrc = '';
  @Input() public logoSrc = 'icons/users-icon.png';
  @Input() public logoAlt = 'Logo';
  @Input() public isCollapsed = false;

  private readonly _notifications: WritableSignal<number> = signal<number>(0);
  private readonly _isDropdownOpen: WritableSignal<boolean> = signal<boolean>(false);

  public readonly hasNotifications: Signal<boolean> = computed(() => this._notifications() > 0);
  public readonly isDropdownOpen: Signal<boolean> = this._isDropdownOpen.asReadonly();

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['notificationsCount']) {
      this._notifications.set(this.notificationsCount);
    }
  }

  public toggleDropdown(): void {
    this._isDropdownOpen.set(!this._isDropdownOpen());
  }

  public closeDropdown(): void {
    this._isDropdownOpen.set(false);
  }

  public logout(e: Event): void {
    e.preventDefault();
    this.closeDropdown();
    this._authService.adminLogout().subscribe();
  }
}