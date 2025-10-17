import { Component, Input, signal } from '@angular/core';
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
  @Input() public type: 'text' | 'email' | 'password' = 'text';
  @Input() public placeholder: string = '';
  @Input() public label: string = '';
  @Input() public formControlName: string = '';
  @Input() public errorMessage: string = '';
  @Input() public iconSrc?: string;
  @Input() public required: boolean = false;
  @Input() public disabled: boolean = false;

  public _value = signal<string>('');
  public _isFocused = signal<boolean>(false);
  public _showPassword = signal<boolean>(false);

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Returns the current value of the input field.
 * @returns {string} The current value of the input field.
 */
/*******  ebcfcf96-b982-4327-85ec-ca3aa0f020e7  *******/
  public get value(): string {
    return this._value();
  }

  public get isFocused(): boolean {
    return this._isFocused();
  }

  public get inputType(): string {
    return this.type === 'password' && !this._showPassword()
      ? 'password'
      : 'text';
  }

  public get hasError(): boolean {
    return !!this.errorMessage;
  }

  public togglePasswordVisibility(): void {
    if (this.type === 'password') {
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
