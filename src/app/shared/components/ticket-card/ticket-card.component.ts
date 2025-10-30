import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/button/button.component'; 


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
    ButtonComponent 
  ],
  templateUrl: './ticket-card.component.html',
  styleUrl: './ticket-card.component.scss'
})
export class TicketCardComponent {

 
  @Input() public ticketInfo: TicketInfo | null = null;

 
  @Output() public registerClick = new EventEmitter<void>();

}

