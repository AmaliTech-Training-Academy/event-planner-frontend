import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '../../ui/button/button.component';
import { APP_ROUTES } from '../../../core/constants/app-routes.constants';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  public readonly navLinks = signal<NavLink[]>([
    { label: 'Home', path: APP_ROUTES.LANDING_PAGE, icon: 'icons/home-icon.png' },
    { label: 'Explore Events', path: APP_ROUTES.EXPLORE, icon: 'icons/action.png' },
    { label: 'About Us', path: APP_ROUTES.ABOUT, icon: 'icons/users-icon.png' },
  ]);

  public readonly isMenuOpen = signal(false);

  public toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  public closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
