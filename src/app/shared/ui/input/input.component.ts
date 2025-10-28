

import { Component, input, signal, computed, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
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
  public type = input<'text' | 'email' | 'password'>('text');
  public placeholder = input<string>('');
  public label = input<string>('');
  public errorMessage = input<string | null>('');
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

  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  writeValue(value: string): void {
    this._value.set(value ?? '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._isDisabled.set(isDisabled);
  }

  public onInput(event: Event): void {
    const newValue = (event.target as HTMLInputElement).value;
    this._value.set(newValue);
    this.onChange(newValue);
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

  public value = this._value.asReadonly();
}