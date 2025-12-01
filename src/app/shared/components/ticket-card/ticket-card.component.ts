import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { TicketType } from '../../../core/models/event.model';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './ticket-card.component.html',
  styleUrl: './ticket-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketCardComponent {
  public ticketInfo = input.required<TicketType>();
  public isPast = input<Boolean>(false);
  public registerClick = output<void>();
  protected isFree = computed(() => this.ticketInfo().price === 0);


  protected capitalizeWords(text: string): string {
    return text
      .toLowerCase()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}


