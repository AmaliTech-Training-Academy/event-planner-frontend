import { Component, input, output, signal, effect } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent {
  /** Label for display next to checkbox (optional) */
  public label = input<string>('');

  /** The current checked state */
  public checked = input<boolean>(false);

  /** Accessibility label (for screen readers, optional) */
  public ariaLabel = input<string>(''); // ✅ Added this input

  /** Emits when the checkbox value changes */
  public checkedChange = output<boolean>();

  /** Internal signal for managing state */
  protected _checked = signal(this.checked());

  constructor() {
    // Keep internal state in sync with external input()
    effect(() => {
      this._checked.set(this.checked());
    });
  }

  /** Returns true if checked */
  public get isChecked(): boolean {
    return this._checked();
  }

  /** Toggles the checkbox and emits change event */
  public toggle(): void {
    this._checked.update((current) => !current);
    this.checkedChange.emit(this._checked());
  }
}
