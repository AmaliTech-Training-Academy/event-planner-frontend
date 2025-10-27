import { Component, Input, signal, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkbox.component.html',
  styleUrls:['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() label: string = '';

  // Use a different property name internally to avoid confusion
  protected get labelText(): string {
    return this.label;
  }

  protected _checked = signal<boolean>(false);
  protected _disabled = signal<boolean>(false);

  private onChange: (value: boolean) => void = () => {};
 public onTouched: () => void = () => {};

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

  // Expose readonly signals
  public checked = this._checked.asReadonly();
  public disabled = this._disabled.asReadonly();
}
