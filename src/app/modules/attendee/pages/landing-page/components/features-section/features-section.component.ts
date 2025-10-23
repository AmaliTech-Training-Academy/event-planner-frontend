import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './features-section.component.html',
  styleUrls: ['./features-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturesSectionComponent {
  protected readonly title = signal<string>('Manage & Collaborate On Events');
  protected readonly description = signal<string>(
    'EventUp is designed to be inclusive, by being able to use your own device to help hybrid-conference teams create, collaborate and celebrate together.'
  );
  protected readonly dashboardImage = signal<string>('images/card-img.png');
}
