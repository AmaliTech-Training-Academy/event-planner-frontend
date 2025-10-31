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
  /** --- Inputs --- */
  public readonly type = input<'text' | 'email' | 'password'>('text');
  public readonly placeholder = input<string>('');
  public readonly label = input<string>('');
  public readonly formControlName = input<string>('');
  public readonly errorMessage = input<string | null>(null);
  public readonly iconSrc = input<string | null>(null);
  public readonly required = input<boolean>(false);
  public readonly disabled = input<boolean>(false);
  public readonly value = input<string>(''); // external model binding

  /** --- Outputs --- */
  public readonly valueChange = output<string>();

  /** --- Internal State --- */
  private readonly _value = signal<string>('');
  private readonly _focused = signal<boolean>(false);
  private readonly _showPassword = signal<boolean>(false);
  private readonly _disabled = signal<boolean>(false);

  /** --- Computed Values --- */
  public readonly hasError = computed(() => !!this.errorMessage());
  public readonly inputType = computed(() =>
    this.type() === 'password' && !this._showPassword() ? 'password' : 'text'
  );
  public readonly showPassword = computed(() => this._showPassword());
  public readonly isFocused = computed(() => this._focused());
  public readonly isDisabled = computed(
    () => this.disabled() || this._disabled()
  );

  constructor() {
    // Sync external `value` input to internal state
    effect(() => {
      const externalValue = this.value();
      if (externalValue !== this._value()) {
        this._value.set(externalValue);
      }
    });
  }

  /** --- ControlValueAccessor --- */
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this._value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  /** --- Public Handlers --- */
  public onValueChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this._value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  public onFocus(): void {
    this._focused.set(true);
  }

  public onBlur(): void {
    this._focused.set(false);
    this.onTouched();
  }

  public togglePasswordVisibility(): void {
    this._showPassword.update((v) => !v);
  }

  /** --- Getters --- */
  public currentValue(): string {
    return this._value();
  }
}
