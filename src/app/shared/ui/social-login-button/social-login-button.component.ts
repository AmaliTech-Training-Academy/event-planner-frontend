import { Component, Input } from '@angular/core';

export type SocialPlatform = 'google' | 'facebook' | 'twitter';

@Component({
  selector: 'app-social-login',
  standalone: true,
  templateUrl: './social-login-button.component.html',
  styleUrls: ['./social-login-button.component.scss'],
})
export class SocialLoginComponent {
  @Input() public platforms: SocialPlatform[] = [
    'google',
    'facebook',
    'twitter',
  ];

  // Returns icon path for a given platform
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

  // Handle click on a social platform
  public onClick(platform: SocialPlatform): void {
    console.log(`${platform} login clicked`);
    // Emit an event here if needed
  }
}
