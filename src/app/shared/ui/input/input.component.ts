import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  input,
  output,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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
export class InputComponent {
  public readonly type = input<'text' | 'email' | 'password'>('text');
  public readonly placeholder = input<string>('');
  public readonly label = input<string>('');
  public readonly formControlName = input<string>('');
  public readonly errorMessage = input<string>('');
  public readonly iconSrc = input<string | undefined>();
  public readonly required = input<boolean>(false);
  public readonly disabled = input<boolean>(false);
  public readonly value = input<string>('');

  /** ✅ New optional style controls */
  public readonly size = input<'sm' | 'md' | 'lg'>('md');
  public readonly extraClass = input<string | string[] | undefined>();

  public readonly valueChange = output<string>();

  private readonly _internalValue = signal<string>('');
  private readonly _isFocused = signal(false);
  private readonly _showPassword = signal(false);

  public readonly hasError = computed(() => !!this.errorMessage());
  public readonly inputType = computed(() =>
    this.type() === 'password' && !this._showPassword() ? 'password' : 'text'
  );
  public readonly showPassword = computed(() => this._showPassword());
  public readonly isFocused = computed(() => this._isFocused());

  // ControlValueAccessor
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this._internalValue.set(value ?? '');
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
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

  public togglePasswordVisibility(): void {
    if (this.type() === 'password') {
      this._showPassword.update((v) => !v);
    }
  }

  /** ✅ Merge size + extraClass for flexible styling */
  public getClasses(): string[] {
    return [this.size(), this.extraClass()]
      .flat()
      .filter((cls): cls is string => !!cls && typeof cls === 'string');
  }
}
