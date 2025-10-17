import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  public type = input<'text' | 'email' | 'password'>('text');
  public placeholder = input<string>('');
  public label = input<string>('');
  public formControlName = input<string>('');
  public errorMessage = input<string>('');
  public iconSrc = input<string | undefined>();
  public required = input<boolean>(false);
  public disabled = input<boolean>(false);

  public _value = signal<string>('');
  public _isFocused = signal<boolean>(false);
  public _showPassword = signal<boolean>(false);

  public get value(): string {
    return this._value();
  }

  public get isFocused(): boolean {
    return this._isFocused();
  }

  public get inputType(): string {
    return this.type() === 'password' && !this._showPassword()
      ? 'password'
      : 'text';
  }

  public get hasError(): boolean {
    return !!this.errorMessage();
  }

  public togglePasswordVisibility(): void {
    if (this.type() === 'password') {
      this._showPassword.update((isVisible) => !isVisible);
    }
  }

  public onFocus(): void {
    this._isFocused.set(true);
  }

  public onBlur(): void {
    this._isFocused.set(false);
  }
}
