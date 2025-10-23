import { Component, ChangeDetectionStrategy } from '@angular/core';
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
  protected readonly title: string = 'Manage & Collaborate On Events';

  protected readonly description: string =
    'EventUp is designed to be inclusive, by being able to use your own device to help hybrid-conference teams create, collaborate and celebrate together.';

  protected readonly dashboardImage: string = 'images/card-img.png';
}
