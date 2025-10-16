import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

interface FooterLinkGroup {
  title: string;
  links: { label: string; path: string }[];
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [RouterLink, CommonModule, LucideAngularModule],
})
export class FooterComponent {
  footerLinks: FooterLinkGroup[] = [
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
  ];

  socialLinks = [
    { name: 'twitter', url: 'https://twitter.com' },
    { name: 'linkedin', url: 'https://linkedin.com' },
    { name: 'instagram', url: 'https://instagram.com' },
  ];
}
