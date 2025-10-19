// features-section.component.ts
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features-section.component.html',
  styleUrls: ['./features-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturesSectionComponent {
  protected readonly _title = signal<string>('Manage & Collaborate On Events');
  protected readonly _description = signal<string>(
    'EventUp is designed to be inclusive, by being able to use your own device to help hybrid-conference teams create, collaborate and celebrate together.'
  );
  protected readonly _dashboardImage = signal<string>(
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'
  );
}
