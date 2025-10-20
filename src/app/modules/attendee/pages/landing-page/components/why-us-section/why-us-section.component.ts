import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  readonly text: string;
  readonly icon?: string;
}

@Component({
  selector: 'app-why-us-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './why-us-section.component.html',
  styleUrls: ['./why-us-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhyUsSectionComponent {
  protected readonly _sectionLabel = signal<string>('ALL FEATURES');
  protected readonly _title = signal<string>(
    'Why should I use this platform over Zoom or Eventbrite?'
  );
  protected readonly _phoneImage = signal<string>(
    'assets/images/phone-img.png'
  );

  protected readonly _features = signal<readonly Feature[]>([
    { text: 'Integration with google meet' },
    { text: 'Get event data analytics' },
    { text: 'Protect events with a passcode' },
    { text: 'Messages with participation' },
    { text: 'Advanced Q&A settings' },
    { text: 'Crowdsource questions' },
  ]);

  /**
   * Track by function for performance optimization in *ngFor
   */
  protected _trackByFeature(index: number, feature: Feature): string {
    return feature.text;
  }
}
