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
  icon: string; 
}


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public readonly navLinks = signal<NavLink[]>([
    { label: 'Home', path: '/', icon: 'icons/home-icon.png' },
    { label: 'Explore Events', path: '/events', icon: 'assets/icons/menu.svg' },
    { label: 'About Us', path: '/about', icon: 'assets/icons/users.svg' },
  ]);

  public readonly isMenuOpen = signal(false);

  public toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  public closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}

