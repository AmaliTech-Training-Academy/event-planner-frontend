import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

interface FooterLinkGroup {
  title: string;
  links: Array<{ label: string; path: string }>;
}

interface SocialLink {
  name: string;
  title: string;
  url: string;
  iconPath: string; 
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  readonly footerLinks = signal<FooterLinkGroup[]>([
    {
      title: 'Platform',
      links: [
        { label: 'Features', path: '/features' },
        { label: 'Solutions', path: '/solutions' },
        { label: 'Pricing', path: '/pricing' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', path: '/about' },
        { label: 'Blog', path: '/blog' },
        { label: 'Careers', path: '/careers' },
      ],
    },
  ]);

 
  readonly socialLinks = signal<SocialLink[]>([
    {
      name: 'Twitter',
      title: 'Follow us on Twitter',
      url: 'https://twitter.com',
      iconPath: 'assets/icons/twitter-icon.png',
    },
    {
      name: 'LinkedIn',
      title: 'Connect with us on LinkedIn',
      url: 'https://linkedin.com',
      iconPath: 'assets/icons/linkedin-icon.png',
    },
    {
      name: 'Instagram',
      title: 'Follow us on Instagram',
      url: 'https://instagram.com',
      iconPath: 'assets/icons/instagram-icon.png',
    },
  ]);

  get footerLinkGroups() {
    return this.footerLinks();
  }

  get socialMediaLinks() {
    return this.socialLinks();
  }
}
