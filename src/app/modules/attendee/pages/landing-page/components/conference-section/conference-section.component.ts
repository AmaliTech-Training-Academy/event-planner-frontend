import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conference-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conference-section.component.html',
  styleUrls: ['./conference-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConferenceSectionComponent {
  protected readonly _title = signal<string>(
    'Powerful virtual conferencing platform solution'
  );
  protected readonly _subtitle = signal<string>(
    'Dedicated spaces that make it easy to come together.'
  );
  protected readonly _conferenceImage = signal<string>(
    'assets/images/conference-img.png'
  );
}
