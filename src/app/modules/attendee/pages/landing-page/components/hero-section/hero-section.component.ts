// hero-section.component.ts
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSectionComponent {
  protected readonly _title = signal<string>('Plan, Host, Engage & Grow');
  protected readonly _subtitle = signal<string>(
    'Bring your community together with powerful tools for hosting productive online and in-person events.'
  );
  protected readonly _heroImage = signal<string>(
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop'
  );

  /**
   * Handles the create event button click
   */
  protected _onCreateEvent(): void {
    // Handle create event action
    console.log('Create event clicked');
  }

  /**
   * Handles the view events button click
   */
  protected _onViewEvents(): void {
    // Handle view events action
    console.log('View events clicked');
  }
}
