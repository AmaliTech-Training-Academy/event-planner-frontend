import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';


export interface VenueSection {
  id: string; 
  name: string;
  price: number;
  imageUrl: string;
  availability: string; 
  availabilityType: 'full' | 'available';
}

@Component({
  selector: 'app-venue-section-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './venue-section-card.component.html',
  styleUrl: './venue-section-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VenueSectionCardComponent {
 
  public readonly section = input.required<VenueSection>();

  protected isFull = computed(() => {
    return this.section().availabilityType === 'full';
  });
}

