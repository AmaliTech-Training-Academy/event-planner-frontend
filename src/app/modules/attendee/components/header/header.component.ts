import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  navLinks: NavLink[] = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Explore Events', path: '/events', icon: Menu },
    { label: 'About Us', path: '/about', icon: Users },
  ];

  MenuIcon = Menu;
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
