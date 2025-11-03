import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  forwardRef,
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

  /** --- Inputs --- */
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Input() placeholder = '';
  @Input() label = '';
  @Input() formControlName = '';
  @Input() errorMessage: string | null = null;
  @Input() iconSrc: string | null = null;
  @Input() required = false;
  @Input() disabled = false;
  @Input() value = '';

  /** --- Outputs --- */
  @Output() valueChange = new EventEmitter<string>();

  /** --- Internal State --- */
  public readonly _value = signal<string>('');
  private readonly _focused = signal<boolean>(false);
  private readonly _showPassword = signal<boolean>(false);
  private readonly _isDisabled = signal<boolean>(false);

  /** --- Computed Values --- */
  readonly hasError = computed(() => !!this.errorMessage);
  readonly inputType = computed(() =>
    this.type === 'password' && !this._showPassword() ? 'password' : this.type
  );
  readonly showPassword = computed(() => this._showPassword());
  readonly isFocused = computed(() => this._focused());
  readonly isDisabled = computed(() => this.disabled || this._isDisabled());

  /** --- ControlValueAccessor --- */
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this._value.set(value ?? '');
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._isDisabled.set(isDisabled);
    this.cdr.markForCheck();
  }

  /** --- Handlers --- */
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this._value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  onFocus(): void {
    this._focused.set(true);
  }

  onBlur(): void {
    this._focused.set(false);
    this.onTouched();
  }

  togglePasswordVisibility(): void {
    this._showPassword.update((v) => !v);
  }

  /** --- Getters --- */
  get currentValue(): string {
    return this._value();
  }
}
