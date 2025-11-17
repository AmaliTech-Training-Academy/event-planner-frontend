import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy, 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';
import { TicketInfo, TicketType } from '../../../core/models/event.model';

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
  public registerClick = output<void>();
  protected isFree = computed(() => this.ticketInfo().price === 0);
}

