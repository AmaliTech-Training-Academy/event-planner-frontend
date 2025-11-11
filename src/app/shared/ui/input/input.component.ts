import {
  Component,
  input,
  signal,
  computed,
  forwardRef,
  output,
  ChangeDetectionStrategy,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ControlValueAccessor,
} from '@angular/forms';
import { FormErrorComponent } from '../form-error/form-error.component';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormErrorComponent],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  // Inputs - reactive values from parent
  public readonly type = input<'text' | 'email' | 'password' | 'number'>(
    'text'
  );
  public readonly placeholder = input<string>('');
  public readonly label = input<string>('');
  public readonly formControlName = input<string>('');
  public readonly errorMessage = input<string | null>('');
  public readonly iconSrc = input<string | undefined>();
  public readonly required = input<boolean>(false);
  public readonly disabled = input<boolean>(false);
  public readonly value = input<string>('');
  public readonly showValidIcon = input<boolean>(false);

  // Outputs
  public readonly valueChange = output<string>();

  // Internal signals - component state only
  private readonly _internalValue = signal<string>('');
  private readonly _isFocused = signal<boolean>(false);
  private readonly _showPassword = signal<boolean>(false);
  private readonly _isDisabled = signal<boolean>(false);

  // Computed values - derived state
  public readonly hasError = computed(() => !!this.errorMessage());

  // ✅ FIX: When password is shown, change type to 'text'
  public readonly inputType = computed(() => {
    if (this.type() === 'password') {
      return this._showPassword() ? 'text' : 'password';
    }
    return this.type();
  });

  public readonly showPassword = computed(() => this._showPassword());
  public readonly isFocused = computed(() => this._isFocused());
  public readonly isDisabled = computed(
    () => this.disabled() || this._isDisabled()
  );

  constructor() {}

  // ControlValueAccessor callbacks
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  // ControlValueAccessor implementation
  public writeValue(value: string): void {
    if (value !== undefined && value !== null) {
      this._internalValue.set(value);
    }
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this._isDisabled.set(isDisabled);
  }

  // Public methods
  public currentValue(): string {
    return this._internalValue();
  }
  private _emitValue(value: string) {
    this.onChange(value);
    this.valueChange.emit(value);
  }
  public onValueChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this._internalValue.set(value);
    this._emitValue(value);
  }
  public readonly inputValue = computed(() => this._internalValue());

  public onFocus(): void {
    this._isFocused.set(true);
  }

  public onBlur(): void {
    this._isFocused.set(false);
    this.onTouched();
  }

  public togglePasswordVisibility(): void {
    this._showPassword.update((current) => !current);
  }
}
