import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
})
export class ButtonComponent {
  readonly type = input<'primary' | 'social'>('primary');
  readonly disabled = input(false);
  readonly fullWidth = input(false);
}
