import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  Home,
  Users,
  Menu,
  LucideIconData,
} from 'lucide-angular';

interface NavLink {
  label: string;
  path: string;
  icon: LucideIconData;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  // Public properties for template binding
  public readonly navLinks = signal<NavLink[]>([
    { label: 'Home', path: '/', icon: Home },
    { label: 'Explore Events', path: '/events', icon: Menu },
    { label: 'About Us', path: '/about', icon: Users },
  ]);

  public readonly isMenuOpen = signal(false);
  public readonly MenuIcon = Menu;

  // Public methods
  public toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  public closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
