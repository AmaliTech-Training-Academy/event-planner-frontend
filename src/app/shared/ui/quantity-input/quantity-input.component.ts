import { Component, Input, forwardRef, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-quantity-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quantity-input.component.html',
  styleUrl: './quantity-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuantityInputComponent),
      multi: true
    }
  ]
})
export class QuantityInputComponent implements ControlValueAccessor {
  min = input(1);
  max = input(10);

  protected value = signal(1);
  protected isDisabled = signal(false);

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value.set(value || this.min());
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  increment() {
    if (this.value() < this.max()) {
      this.value.update(v => v + 1);
      this.onChange(this.value());
      this.onTouched();
    }
  }

  decrement() {
    if (this.value() > this.min()) {
      this.value.update(v => v - 1);
      this.onChange(this.value());
      this.onTouched();
    }
  }
}

