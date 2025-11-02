import {
  Component,
  forwardRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
  signal,
  computed,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
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
  private readonly cdr = inject(ChangeDetectorRef);

  // --- Inputs ---
  type: 'text' | 'email' | 'password' = 'text';
  placeholder = '';
  label = '';
  iconSrc: string | null = null;
  required = false;
  disabled = false;
  errorMessage: string | null = null;

  // --- Internal State ---
 public readonly _value = signal<string>('');
  private readonly _focused = signal<boolean>(false);
  private readonly _showPassword = signal<boolean>(false);

  // --- Computed ---
  readonly hasError = computed(() => !!this.errorMessage);
  readonly inputType = computed(() =>
    this.type === 'password' && !this._showPassword() ? 'password' : this.type
  );
  readonly showPassword = computed(() => this._showPassword());
  readonly isFocused = computed(() => this._focused());

  // --- ControlValueAccessor methods ---
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this._value.set(value ?? '');
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  // --- Handlers ---
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this._value.set(value);
    this.onChange(value);
  }

  onBlur(): void {
    this._focused.set(false);
    this.onTouched();
  }

  onFocus(): void {
    this._focused.set(true);
  }

  togglePasswordVisibility(): void {
    this._showPassword.update(v => !v);
  }

  get value(): string {
    return this._value();
  }
}
