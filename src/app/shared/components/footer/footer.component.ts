import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlatformSettingsService } from '@app/core/services/platform-settings.service';
import { LogoComponent } from '@app/modules/auth/components/logo/logo.component';

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
  imports: [CommonModule, RouterLink, NgOptimizedImage, LogoComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  private readonly _platformSettingsService = inject(PlatformSettingsService);

  protected readonly platformName: Signal<string> = this._platformSettingsService.platformName;
  protected readonly footerLinks: readonly FooterLinkGroup[] = [
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

  protected readonly socialLinks: readonly SocialLink[] = [
    {
      name: 'Twitter',
      title: 'Follow us on Twitter',
      url: 'https://twitter.com',
      iconPath: 'icons/twitter-icon.png',
    },
    {
      name: 'LinkedIn',
      title: 'Connect with us on LinkedIn',
      url: 'https://linkedin.com',
      iconPath: 'icons/linkedin-icon.png',
    },
    {
      name: 'Instagram',
      title: 'Follow us on Instagram',
      url: 'https://instagram.com',
      iconPath: 'icons/instagram-icon.png',
    },
  ];
}
