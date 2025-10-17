import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
})
export class ButtonComponent {
  @Input() type: 'primary' | 'social' = 'primary';

  @Input() set disabled(value: boolean) {
    this._disabled.set(value);
  }
  _disabled = signal(false);

  @Input() set fullWidth(value: boolean) {
    this._fullWidth.set(value);
  }
  _fullWidth = signal(false);
}
