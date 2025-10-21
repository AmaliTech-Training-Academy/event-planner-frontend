import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
})
export class ButtonComponent {
_disabled() {
throw new Error('Method not implemented.');
}
_fullWidth() {
throw new Error('Method not implemented.');
}
  public readonly type = input<'primary' | 'social'>('primary');
  public readonly disabled = input(false);
  public readonly fullWidth = input(false);
}
