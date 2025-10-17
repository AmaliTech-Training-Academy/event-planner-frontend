import { Component, Input } from '@angular/core';

export type SocialPlatform = 'google' | 'facebook' | 'twitter';

@Component({
  selector: 'app-social-login',
  standalone: true,
  templateUrl: './social-login-button.component.html',
  styleUrls: ['./social-login-button.component.scss'],
})
export class SocialLoginComponent {
  @Input() platforms: SocialPlatform[] = ['google', 'facebook', 'twitter'];

  getIconSrc(platform: SocialPlatform): string {
    switch (platform) {
      case 'google':
        return 'assets/icons/google.svg';
      case 'facebook':
        return 'assets/icons/facebook.svg';
      case 'twitter':
        return 'assets/icons/twitter.svg';
      default:
        return '';
    }
  }

  onClick(platform: SocialPlatform) {
    console.log(`${platform} login clicked`);
    // Emit an event here if needed
  }
}
