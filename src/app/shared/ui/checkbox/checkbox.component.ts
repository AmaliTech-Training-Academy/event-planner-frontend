import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() ariaLabel: string = '';
  @Output() checkedChange = new EventEmitter<boolean>();

  private _checked = signal<boolean>(false);
  private _disabled = signal<boolean>(false);

  get isChecked(): boolean {
    return this._checked();
  }
  get isDisabled(): boolean {
    return this._disabled();
  }

  // ControlValueAccessor implementation
  writeValue(value: boolean): void {
    this._checked.set(value ?? false);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  toggleCheck(): void {
    if (this.isDisabled) return;

    const newValue = !this._checked();
    this._checked.set(newValue);
    this.checkedChange.emit(newValue);
    this.onChange(newValue);
    this.onTouched();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Space' || event.key === ' ') {
      event.preventDefault();
      this.toggleCheck();
    }
  }

  protected onChange: (value: boolean) => void = () => {};
  protected onTouched: () => void = () => {};
}
