import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  NgControl,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() formControlName: string = '';
  @Input() errorMessage: string = '';
  @Input() iconSrc?: string; // image path
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;

  // Signals for reactive UI
  _value = signal('');
  _isFocused = signal(false);
  _showPassword = signal(false);

  get inputType() {
    return this.type === 'password' && !this._showPassword()
      ? 'password'
      : 'text';
  }

  togglePasswordVisibility() {
    if (this.type === 'password') {
      this._showPassword.update((v) => !v);
    }
  }

  onFocus() {
    this._isFocused.set(true);
  }

  onBlur() {
    this._isFocused.set(false);
  }

  // Derived state for classes
  get hasError() {
    return !!this.errorMessage;
  }
}
