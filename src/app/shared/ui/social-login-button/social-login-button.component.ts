import { Component, input, signal } from '@angular/core';

export type SocialPlatform = 'google' | 'facebook' | 'twitter';

@Component({
  selector: 'app-social-login',
  standalone: true,
  templateUrl: './social-login-button.component.html',
  styleUrls: ['./social-login-button.component.scss'],
})
export class SocialLoginComponent {
  public readonly platforms = input<SocialPlatform[]>([
    'google',
    'facebook',
    'twitter',
  ]);

  public getIconSrc(platform: SocialPlatform): string {
    switch (platform) {
      case 'google':
        return 'assets/icons/google-icon.png';
      case 'facebook':
        return 'assets/icons/facebook-icon.png';
      case 'twitter':
        return 'assets/icons/twitter-icon.png';
      default:
        return '';
    }
  }

  public onClick(platform: SocialPlatform): void {
    // Handle social login click
  }
}
