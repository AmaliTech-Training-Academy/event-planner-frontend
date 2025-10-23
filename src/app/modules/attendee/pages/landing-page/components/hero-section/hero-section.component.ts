import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../../../shared/components/button/button.component';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSectionComponent {
  protected readonly _title = signal('Plan, Host, Engage & Grow');
  protected readonly _subtitle = signal(
    'Bring your community together with powerful tools for hosting productive online and in-person events.'
  );
  protected readonly _heroImage = signal('assets/images/hero-image.png');

  // 🎨 SVG icon paths
  protected readonly _icons = signal({
    mic: 'assets/icons/microphone-icon.svg',
    video: 'assets/icons/video-icon.svg',
    phone: 'assets/icons/phone-icon.svg',
    mail: 'assets/icons/message-icon.svg',
    settings: 'assets/icons/collaboration-icon.svg',
  });

  protected _onCreateEvent(): void {
    // Handle create event action
  }

  protected _onViewEvents(): void {
    console.log('View events clicked');
  }
}
