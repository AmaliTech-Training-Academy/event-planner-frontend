import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  Component,
  signal,
  OnInit,
  inject,
  HostListener,
  ElementRef,
  computed,
  ChangeDetectionStrategy,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { ButtonComponent } from '../../ui/button/button.component';
import { AuthService } from '../../../core/services/auth.service';
import { APP_ROUTES } from '../../../core/constants/app-routes.constants';
import { OtpBodyData } from '../../../core/models/auth-response.model';

interface NavLink {
  readonly label: string;
  readonly path: string;
  readonly icon: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    RouterLinkActive,
    ButtonComponent,
    NgOptimizedImage
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _elementRef: ElementRef = inject(ElementRef);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  protected readonly APP_ROUTES = APP_ROUTES;

  protected readonly navLinks = signal<readonly NavLink[]>([
    { label: 'Home', path: '/', icon: 'icons/home-icon.png' },
    { label: 'Explore Events', path: '/app/explore', icon: 'icons/action.png' },
    { label: 'About Us', path: '/app/about', icon: 'icons/users-icon.png' },
  ]);

  protected readonly isMenuOpen = signal<boolean>(false);
  protected readonly isUserMenuOpen = signal<boolean>(false);
  protected readonly isLoggedIn = signal<boolean>(false);
  
  private readonly _currentUser = signal<OtpBodyData | null>(null);

  protected readonly userInitials = computed<string>(() => {
    const user = this._currentUser();
    if (!user?.fullName) return '';

    const names: string[] = user.fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  });

  protected readonly userName = computed<string>(() => {
    const user = this._currentUser();
    if (!user?.fullName) return '';

    const firstName: string = user.fullName.trim().split(' ')[0];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1);
  });

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside: boolean = this._elementRef.nativeElement.contains(target);

    if (!clickedInside) {
      if (this.isMenuOpen()) {
        this.closeMenu();
      }
      
      const userDropdown = target.closest('.header__user-dropdown');
      if (!userDropdown && this.isUserMenuOpen()) {
        this.closeUserMenu();
      }
    }
  }

  @HostListener('window:resize')
  protected onWindowResize(): void {
    if (window.innerWidth > 1024 && this.isMenuOpen()) {
      this.closeMenu();
    }
  }

  public ngOnInit(): void {
    this._authService
      .isLoggedIn()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((loggedIn: boolean) => {
        this.isLoggedIn.set(loggedIn);
        if (loggedIn) {
          const user: OtpBodyData | null = this._authService.currentUser();
          this._currentUser.set(user);
        } else {
          this._currentUser.set(null);
        }
      });
  }

  public getUserInitials(): string {
    return this.userInitials();
  }

  public getUserName(): string {
    return this.userName();
  }

  public toggleMenu(): void {
    this.isMenuOpen.update((isOpen: boolean) => !isOpen);
    if (this.isMenuOpen()) {
      this._disableBodyScroll();
    } else {
      this._enableBodyScroll();
    }
  }

  public toggleUserMenu(): void {
    this.isUserMenuOpen.update((isOpen: boolean) => !isOpen);
  }

  public closeMenu(): void {
    this.isMenuOpen.set(false);
    this._enableBodyScroll();
  }

  public closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }

  public logout(): void {
    this._authService
      .logout()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this._closeAllMenus();
        },
        error: () => {
          this._closeAllMenus();
        }
      });
  }

  private _closeAllMenus(): void {
    this.closeMenu();
    this.closeUserMenu();
  }

  private _disableBodyScroll(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  private _enableBodyScroll(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
}