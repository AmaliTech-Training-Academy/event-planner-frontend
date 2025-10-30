import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-help-card',
  standalone: true,
  imports: [],
  templateUrl: './help-card.component.html',
  styleUrl: './help-card.component.scss'
})
export class HelpCardComponent {
  
  @Input() public email: string = '';
}

