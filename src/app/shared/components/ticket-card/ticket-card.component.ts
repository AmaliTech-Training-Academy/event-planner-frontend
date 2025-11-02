import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';

export interface TicketInfo {
  title: string; 
  price: number;
  currency: string;
  features: string[];
}

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './ticket-card.component.html',
  styleUrl: './ticket-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketCardComponent {
  
  public readonly ticketInfo = input.required<TicketInfo>();

  public readonly registerClick = output<void>();

  protected onRegisterClick(): void {
    this.registerClick.emit();
  }
}

