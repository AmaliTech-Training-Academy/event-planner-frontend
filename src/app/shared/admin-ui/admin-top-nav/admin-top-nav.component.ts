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
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
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
export class AdminTopNavComponent implements OnChanges, OnInit, OnDestroy {
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _destroy$ = new Subject<void>();

  protected readonly APP_ROUTES = APP_ROUTES;

  @Input() public pageTitle = '';
  @Input() public notificationsCount = 0;
  @Input() public userName = '';
  @Input() public avatarSrc = '';
  @Input() public logoSrc = 'icons/users-icon.png';
  @Input() public logoAlt = 'Logo';
  @Input() public isCollapsed = false;

  // Signals for reactive data
  protected readonly _isCollapsed: WritableSignal<boolean> =
    signal<boolean>(false);
  private readonly _notifications: WritableSignal<number> = signal<number>(0);
  private readonly _isDropdownOpen: WritableSignal<boolean> =
    signal<boolean>(false);
  private readonly _showLogoutModal: WritableSignal<boolean> =
    signal<boolean>(false);

  // Computed signals for the template
  public readonly hasNotifications: Signal<boolean> = computed(
    () => this._notifications() > 0
  );
  public readonly isDropdownOpen: Signal<boolean> =
    this._isDropdownOpen.asReadonly();
  public readonly showLogoutModal: Signal<boolean> =
    this._showLogoutModal.asReadonly();
  public readonly isNavCollapsed: Signal<boolean> =
    this._isCollapsed.asReadonly();

  // Reactive user data from auth service
  public readonly currentUser = this._authService.currentUser$();

  // Computed signals for user data with fallbacks
  public readonly displayName = computed(() => {
    const user = this._authService.currentUser();
    console.log('👤 AdminTopNav - Current user for display name:', user);
    return user?.fullName || this.userName || 'Administrator';
  });

  public readonly displayAvatar = computed(() => {
    const user = this._authService.currentUser();
    console.log('🖼️ AdminTopNav - Current user for avatar:', user);
    return user?.profilePicture || this.avatarSrc || 'icons/default-avatar.png';
  });

  ngOnInit(): void {
    console.log('🎯 AdminTopNav - Component initialized');

    // Subscribe to user changes to ensure we have the latest data
    this._authService
      .currentUser$()
      .pipe(takeUntil(this._destroy$))
      .subscribe((user) => {
        console.log('🔄 AdminTopNav - User data updated:', user);
        console.log('📊 AdminTopNav - Input values:', {
          userName: this.userName,
          avatarSrc: this.avatarSrc,
        });
      });

    // Log initial state
    const initialUser = this._authService.currentUser();
    console.log('📸 AdminTopNav - Initial user state:', initialUser);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    console.log('🔄 AdminTopNav - Input changes:', changes);

    if (changes['notificationsCount']) {
      this._notifications.set(this.notificationsCount);
    }

    if (changes['isCollapsed']) {
      this._isCollapsed.set(this.isCollapsed);
    }

    // Log when userName or avatarSrc inputs change
    if (changes['userName']) {
      console.log('📝 AdminTopNav - userName input changed to:', this.userName);
    }

    if (changes['avatarSrc']) {
      console.log(
        '🖼️ AdminTopNav - avatarSrc input changed to:',
        this.avatarSrc
      );
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
