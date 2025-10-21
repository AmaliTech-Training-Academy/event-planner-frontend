import { Component, input, signal, computed } from '@angular/core';
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

  private _value = signal<string>('');
  private _isFocused = signal<boolean>(false);
  private _showPassword = signal<boolean>(false);

  public hasError = computed(() => !!this.errorMessage());
  public inputType = computed(() =>
    this.type() === 'password' && !this._showPassword() ? 'password' : 'text'
  );
  public showPassword = computed(() => this._showPassword());
  public isFocused = computed(() => this._isFocused());

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
  }

  public value = this._value.asReadonly();
}
