import { Component, Input, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() errorMessage: string = '';
  @Input() iconSrc?: string;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;

 
  private _value = signal<string>('');
  private _isFocused = signal<boolean>(false);
  private _showPassword = signal<boolean>(false);

  
  public value = this._value.asReadonly();
  public isFocused = computed(() => this._isFocused());
  public showPassword = computed(() => this._showPassword());
  public inputType = computed(() =>
    this.type === 'password' && !this._showPassword() ? 'password' : this.type
  );
  




  
  private onChange: (v: any) => void = () => {};
  private onTouched: () => void = () => {};

  
  writeValue(obj: any): void {
    this._value.set(obj ?? '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  
  public onInput(event: Event): void {
  const target = event.target as HTMLInputElement | null;
  const val = target?.value ?? '';
  this._value.set(val);
  
  if (this.onChange) {
    this.onChange(val);
  }
}

  onFocus(): void {
    this._isFocused.set(true);
  }

  onBlur(): void {
    this._isFocused.set(false);
    this.onTouched();
  }

  togglePasswordVisibility(): void {
    if (this.type === 'password') {
      this._showPassword.update(v => !v);
    }
  }
}
