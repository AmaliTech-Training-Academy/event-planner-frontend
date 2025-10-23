import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-conference-section',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './conference-section.component.html',
  styleUrls: ['./conference-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConferenceSectionComponent {
  protected readonly title: string =
    'Powerful virtual conferencing platform solution';

  protected readonly subtitle: string =
    'Dedicated spaces that make it easy to come together.';

  protected readonly conferenceImage: string = 'images/conference-img.png';
}
