import { CommonModule } from '@angular/common';
import {
  Component,
  signal,
  OnInit,
  inject,
  HostListener,
  ElementRef,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '../../ui/button/button.component';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { APP_ROUTES } from '../../../core/constants/app-routes.constants';
import { OtpBodyData } from '../../../core/models/auth-response.model';

interface NavLink {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly elementRef = inject(ElementRef);
  protected readonly APP_ROUTES = APP_ROUTES;

  public readonly navLinks = signal<NavLink[]>([
    { label: 'Home', path: '/', icon: 'icons/home-icon.png' },
    { label: 'Explore Events', path: '/app/explore', icon: 'icons/action.png' },
    { label: 'About Us', path: '/app/about', icon: 'icons/users-icon.png' },
  ]);

  public readonly isMenuOpen = signal(false);
  public readonly currentUser = signal<OtpBodyData | null>(null); // Changed from User to OtpBodyData

  public readonly isLoggedIn = signal(false);
  public readonly isUserMenuOpen = signal(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside = this.elementRef.nativeElement.contains(target);

    if (!clickedInside && this.isMenuOpen()) {
      this.closeMenu();
    }

    const userDropdown = target.closest('.header__user-dropdown');
    if (!userDropdown && this.isUserMenuOpen()) {
      this.closeUserMenu();
    }
  }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn.set(loggedIn);
      if (loggedIn) {
        const user = this.authService.currentUser();
        this.currentUser.set(user);
      }
    });
  }

  public getUserInitials(): string {
    const user = this.currentUser();
    if (!user || !user.fullName) return '';

    const names = user.fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  }

  public getUserName(): string {
    const user = this.currentUser();
    return user?.fullName || '';
  }

  public toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  public toggleUserMenu(): void {
    this.isUserMenuOpen.update((isOpen) => !isOpen);
  }

  public closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  public closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }

  public closeAllMenus(): void {
    this.closeMenu();
    this.closeUserMenu();
  }

  public logout(): void {
    this.authService.logout().subscribe();
    this.closeAllMenus();
  }
}
