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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormErrorComponent, ButtonComponent],
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
  
export class InputComponent implements ControlValueAccessor {
  public type = input<'text' | 'email' | 'password'>('text');
  public placeholder = input<string>('');
  public label = input<string>('');
  public errorMessage = input<string>('');
  public iconSrc = input<string | undefined>();
  public required = input<boolean>(false);
  public disabled = input<boolean>(false);

  private _value = signal<string>('');
  private _isFocused = signal<boolean>(false);
  private _showPassword = signal<boolean>(false);
  private _isDisabled = signal<boolean>(false);

  public hasError = computed(() => !!this.errorMessage());
  public inputType = computed(() =>
    this.type() === 'password' && !this._showPassword() ? 'password' : 'text'
  );
  public isFocused = computed(() => this._isFocused());
  public showPassword = computed(() => this._showPassword());
  public isDisabled = computed(() => this.disabled() || this._isDisabled());

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

  public getClasses(): string[] {
    return [this.size(), this.extraClass()]
      .flat()
      .filter((cls): cls is string => !!cls && typeof cls === 'string');
  }
}
