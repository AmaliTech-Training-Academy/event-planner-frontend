import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

interface Feature {
  readonly text: string;
  readonly icon?: string;
}

@Component({
  selector: 'app-why-us-section',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './why-us-section.component.html',
  styleUrls: ['./why-us-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhyUsSectionComponent {
  protected readonly sectionLabel = 'ALL FEATURES';
  protected readonly title =
    'Why should I use this platform over Zoom or Eventbrite?';
  protected readonly phoneImage = 'images/phone-img.png';
  protected readonly checkIcon = 'icons/check-mark.svg';

  protected readonly features: readonly Feature[] = [
    { text: 'Integration with Google Meet' },
    { text: 'Get event data analytics' },
    { text: 'Protect events with a passcode' },
    { text: 'Messages with participation' },
    { text: 'Advanced Q&A settings' },
    { text: 'Crowdsource questions' },
  ];

  protected trackByFeature(index: number, feature: Feature): string {
    return feature.text;
  }
}
