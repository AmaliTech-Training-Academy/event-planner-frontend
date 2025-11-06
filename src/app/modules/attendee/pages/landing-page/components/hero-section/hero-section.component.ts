import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, ButtonComponent],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSectionComponent {
  protected readonly title = 'Plan, Host, Engage & Grow';
  protected readonly subtitle =
    'Bring your community together with powerful tools for hosting productive online and in-person events.';
  protected readonly heroImage = 'images/hero-image.png';

  protected readonly icons = {
    mic: 'icons/microphone-icon.svg',
    video: 'icons/video-icon.svg',
    phone: 'icons/phone-icon.svg',
    mail: 'icons/message-icon.svg',
    settings: 'icons/collaboration-icon.svg',
  };

  protected onCreateEvent(): void {
    // TODO: handle create event action
  }

  protected onViewEvents(): void {
  }
}
