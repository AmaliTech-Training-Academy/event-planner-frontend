import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; // For @if, @for
import { ButtonComponent } from '../../../shared/ui/button/button.component'; // Import button

// 1. Define the data structure for the ticket
export interface TicketInfo {
  price: number;
  currency: string;
  features: string[];
}

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent // 2. Add ButtonComponent to imports
  ],
  templateUrl: './ticket-card.component.html',
  styleUrl: './ticket-card.component.scss'
})
export class TicketCardComponent {

  // 3. Define the public Input to receive ticket data
  @Input() public ticketInfo: TicketInfo | null = null;

  // 4. Define the public Output to emit the click event
  @Output() public registerClick = new EventEmitter<void>();

}

