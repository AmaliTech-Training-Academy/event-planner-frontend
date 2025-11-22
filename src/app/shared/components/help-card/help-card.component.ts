import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-help-card',
  standalone: true,
  imports: [],
  templateUrl: './help-card.component.html',
  styleUrl: './help-card.component.scss'
})
export class HelpCardComponent {
public email = input<string>('');
}

