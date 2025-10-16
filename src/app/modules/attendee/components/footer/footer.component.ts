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
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [RouterLink, CommonModule, LucideAngularModule],
  standalone: true,
})
export class FooterComponent {
  // Reactive state
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
    { name: 'twitter', url: 'https://twitter.com' },
    { name: 'linkedin', url: 'https://linkedin.com' },
    { name: 'instagram', url: 'https://instagram.com' },
  ]);
}
