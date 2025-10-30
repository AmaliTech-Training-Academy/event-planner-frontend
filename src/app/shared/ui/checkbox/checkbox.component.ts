import {
  Component,
  input,
  output,
  signal,
  effect,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
} from '@angular/forms';

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

  public checkedChange = output<boolean>();

  private _checked = signal<boolean>(false);
  private _disabled = false;

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      this._checked.set(this.checked());
    });
  }

  public get isChecked(): boolean {
    return this._checked();
  }

  public get isDisabled(): boolean {
    return this._disabled;
  }

  writeValue(value: boolean): void {
    this._checked.set(value ?? false);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  public toggle(): void {
    if (this._disabled) return;
    const newValue = !this._checked();
    this._checked.set(newValue);
    this.onChange(newValue);
    this.onTouched();
    this.checkedChange.emit(newValue);
  }
}
