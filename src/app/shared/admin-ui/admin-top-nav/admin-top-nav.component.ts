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
import { ButtonComponent } from '../../ui/button/button.component';
import { AuthService } from '../../../core/services/auth.service';
import { APP_ROUTES } from '../../../core/constants/app-routes.constants';
import { LogoutConfirmationModalComponent } from '../../components/logout-confirmation-modal/logout-confirmation-modal.component';

@Component({
  selector: 'app-admin-top-nav',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    RouterLink,
    ButtonComponent,
    LogoutConfirmationModalComponent,
],
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
  private readonly _isDropdownOpen: WritableSignal<boolean> =
    signal<boolean>(false);
  private readonly _showLogoutModal: WritableSignal<boolean> =
    signal<boolean>(false); // Add this

  public readonly hasNotifications: Signal<boolean> = computed(
    () => this._notifications() > 0
  );
  public readonly isDropdownOpen: Signal<boolean> =
    this._isDropdownOpen.asReadonly();
  public readonly showLogoutModal: Signal<boolean> =
    this._showLogoutModal.asReadonly(); // Add this

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
    // Show modal instead of logging out directly
    this._showLogoutModal.set(true);
  }

  public onLogoutConfirm(): void {
    this._showLogoutModal.set(false);
    this._authService.adminLogout().subscribe();
  }

  public onLogoutCancel(): void {
    this._showLogoutModal.set(false);
  }
}
