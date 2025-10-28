import { Component, input, output, signal, effect } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  public label = input<string>('');

  public checked = input<boolean>(false);

  public ariaLabel = input<string>(''); 

  public checkedChange = output<boolean>();

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Keep internal state in sync with external input()
    effect(() => {
      this._checked.set(this.checked());
    });
  }

  public get isChecked(): boolean {
    return this._checked();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  public toggleCheck(): void {
    if (this._disabled()) return;
    const newValue = !this._checked();
    this._checked.set(newValue);
    this.onChange(newValue);
    this.onTouched();
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Space' || event.key === ' ') {
      event.preventDefault();
      this.toggleCheck();
    }
  }

  public checked = this._checked.asReadonly();
  public disabled = this._disabled.asReadonly();
}
