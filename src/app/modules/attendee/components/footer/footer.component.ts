import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

interface FooterLinkGroup {
  title: string;
  links: { label: string; path: string }[];
}

interface SocialLink {
  name: string;
  url: string;
  iconPath: string; // full path to asset
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [RouterLink, CommonModule, LucideAngularModule],
  standalone: true,
})
export class FooterComponent {
  footerLinks = signal<FooterLinkGroup[]>([
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

  socialLinks = signal<SocialLink[]>([
    {
      name: 'Twitter',
      url: 'https://twitter.com',
      iconPath: 'assets/icons/twitter-icon.png',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      iconPath: 'assets/icons/linkedin-icon.png',
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      iconPath: 'assets/icons/instagram-icon.png',
    },
  ]);
}
