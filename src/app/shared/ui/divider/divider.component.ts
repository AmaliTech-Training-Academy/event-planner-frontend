import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-divider',
  standalone: true,
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
  imports: [CommonModule],
})
export class DividerComponent {
  public text = input<string>('');
}
