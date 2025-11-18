import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy, 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';
import { TicketInfo } from '../../../core/models/events';

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './ticket-card.component.html',
  styleUrl: './ticket-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, 
})
export class TicketCardComponent {
  public ticketInfo = input.required<TicketInfo>();
  public registerClick = output<void>();
  protected isFree = computed(() => this.ticketInfo().price === 0);
}

