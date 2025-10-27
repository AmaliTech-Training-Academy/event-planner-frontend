import { Component, input, signal, computed, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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
  public type = input<'text' | 'email' | 'password'>('text');
  public placeholder = input<string>('');
  public label = input<string>('');
  public formControlName = input<string>('');
  public errorMessage = input<string>('');
  public iconSrc = input<string | undefined>();
  public required = input<boolean>(false);
  public disabled = signal<boolean>(false);

  private _value = signal<string>('');
  private _isFocused = signal<boolean>(false);
  private _showPassword = signal<boolean>(false);

  public hasError = computed(() => !!this.errorMessage());
  public inputType = computed(() =>
    this.type() === 'password' && !this._showPassword() ? 'password' : 'text'
  );
  public showPassword = computed(() => this._showPassword());
  public isFocused = computed(() => this._isFocused());

  
  private onChange = (value: string) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    this._value.set(value || '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
 

  public togglePasswordVisibility(): void {
    if (this.type() === 'password') {
      this._showPassword.update((v) => !v);
    }
  }

  public onFocus(): void {
    this._isFocused.set(true);
  }

  public onBlur(): void {
    this._isFocused.set(false);
    this.onTouched();
  }

  public value = this._value.asReadonly();

 
  public onValueChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this._value.set(value);
    this.onChange(value);
  }
}
