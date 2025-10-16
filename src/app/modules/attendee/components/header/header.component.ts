import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideAngularModule,
  Home,
  Menu,
  Users,
  LucideIconData,
  Calendar,
} from 'lucide-angular';

interface NavLink {
  label: string;
  path: string;
  icon: LucideIconData;
}

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
})
export class HeaderComponent {
  // Navigation links
  navLinks: NavLink[] = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Explore Events', path: '/events', icon: Calendar },
    { label: 'About Us', path: '/about', icon: Users },
  ];

  // Hamburger state
  isMenuOpen = false;
  MenuIcon = Menu;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
