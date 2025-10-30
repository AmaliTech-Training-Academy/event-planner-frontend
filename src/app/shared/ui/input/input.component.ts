import { Component, input, signal, computed, forwardRef, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {

  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ControlValueAccessor,
} from '@angular/forms';
import { FormErrorComponent } from "../form-error/form-error.component";

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormErrorComponent],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  public readonly type = input<'text' | 'email' | 'password'>('text');
  public readonly placeholder = input<string>('');
  public readonly label = input<string>('');
  public readonly formControlName = input<string>('');
  public readonly errorMessage = input<string>('');
  public readonly iconSrc = input<string | undefined>();
  public readonly required = input<boolean>(false);
  public readonly disabled = input<boolean>(false);
  public readonly value = input<string>('');

  public readonly size = input<'sm' | 'md' | 'lg'>('md');
  public readonly extraClass = input<string | string[] | undefined>();

  public readonly valueChange = output<string>();

  private readonly _internalValue = signal<string>('');
  private readonly _isFocused = signal(false);
  private readonly _showPassword = signal(false);
  private _isDisabled = signal<boolean>(false);

  public readonly hasError = computed(() => !!this.errorMessage());
  public readonly inputType = computed(() =>
    this.type() === 'password' && !this._showPassword() ? 'password' : 'text'
  );
  public readonly showPassword = computed(() => this._showPassword());
  public readonly isFocused = computed(() => this._isFocused());
  public readonly isDisabled = computed(
    () => this.disabled() || this._isDisabled()
  );

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._isDisabled.set(isDisabled);
  }

  public currentValue(): string {
    return this.value() ?? this._internalValue();
  }

  public onInput(value: string): void {
    this._internalValue.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  public onFocus(): void {
    this._isFocused.set(true);
  }

  public onBlur(): void {
    this._isFocused.set(false);
    this.onTouched();
  }


 
  public onValueChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value();
    this.onChange(value);
  }
  togglePasswordVisibility(): void {
    this._showPassword.set(!this._showPassword());
    this.onChange(this.currentValue());
    this.valueChange.emit(this.currentValue());
  }
}
