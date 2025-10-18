import {
  Component,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface Partner {
  readonly name: string;
  readonly imageUrl: string;
}

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnersComponent {
  private readonly initialPartners: readonly Partner[] = [
    {
      name: 'Slack',
      imageUrl: 'https://via.placeholder.com/120x40/000000/FFFFFF?text=Slack',
    },
    {
      name: 'Netflix',
      imageUrl: 'https://via.placeholder.com/120x40/E50914/FFFFFF?text=Netflix',
    },
    {
      name: 'Google',
      imageUrl: 'https://via.placeholder.com/120x40/4285F4/FFFFFF?text=Google',
    },
    {
      name: 'Airbnb',
      imageUrl: 'https://via.placeholder.com/120x40/FF5A5F/FFFFFF?text=Airbnb',
    },
    {
      name: 'UNICEF',
      imageUrl: 'https://via.placeholder.com/120x40/00AEEF/FFFFFF?text=UNICEF',
    },
    {
      name: 'Adobe',
      imageUrl: 'https://via.placeholder.com/120x40/FF0000/FFFFFF?text=Adobe',
    },
    {
      name: 'Microsoft',
      imageUrl:
        'https://via.placeholder.com/120x40/00A4EF/FFFFFF?text=Microsoft',
    },
  ];

  protected readonly _partners = signal<readonly Partner[]>(
    this.initialPartners
  );
  protected readonly _partnerCount = computed(() => this._partners().length);

  /**
   * Track by function for performance optimization in *ngFor
   */
  protected _trackByPartnerName(index: number, partner: Partner): string {
    return partner.name;
  }
}
