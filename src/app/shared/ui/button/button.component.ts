import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
})
export class ButtonComponent {
  /** Button type: primary | social */
  @Input() type: 'primary' | 'social' = 'primary';

  /** Disabled state */
  @Input() set disabled(value: boolean) {
    this._disabled.set(value);
  }
  _disabled = signal(false);

  /** Full width button */
  @Input() set fullWidth(value: boolean) {
    this._fullWidth.set(value);
  }
  _fullWidth = signal(false);

  /** Hover state */
  hover = signal(false);

  /** Active state */
  active = signal(false);

  onMouseEnter() {
    this.hover.set(true);
  }

  onMouseLeave() {
    this.hover.set(false);
    this.active.set(false);
  }

  onMouseDown() {
    this.active.set(true);
  }

  onMouseUp() {
    this.active.set(false);
  }
}
