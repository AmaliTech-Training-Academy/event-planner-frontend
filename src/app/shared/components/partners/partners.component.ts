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
      imageUrl: 'images/slack-img.png',
    },
    {
      name: 'Netflix',
      imageUrl: 'images/netflix-img.png',
    },
    {
      name: 'Google',
      imageUrl: 'images/google-img.png',
    },
    {
      name: 'Airbnb',
      imageUrl: 'images/airbnb-img.png',
    },
    {
      name: 'UNICEF',
      imageUrl: 'images/unicef-img.png',
    },
    {
      name: 'Adobe',
      imageUrl: 'images/adobe-img.png',
    },
    {
      name: 'Microsoft',
      imageUrl: 'images/microsoft-img.png',
    },
  ];

  protected readonly _partners = signal<readonly Partner[]>(
    this.initialPartners
  );
  protected readonly _partnerCount = computed(() => this._partners().length);

  
  protected _trackByPartnerName(index: number, partner: Partner): string {
    return partner.name;
  }
}
