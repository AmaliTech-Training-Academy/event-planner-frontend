// checkbox.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() public label: string = '';
  @Input() public ariaLabel: string = '';

  protected value: boolean = false;
  protected isDisabled: boolean = false;

  // ControlValueAccessor callbacks
  private _onChange: (value: boolean) => void = () => {};
  private _onTouched: () => void = () => {};

  // ControlValueAccessor implementation
  public writeValue(value: boolean): void {
    this.value = value ?? false;
  }

  public registerOnChange(fn: (value: boolean) => void): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // Handle input change
  protected onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.checked;
    this._onChange(this.value);
  }

  // Handle blur
  protected onBlur(): void {
    this._onTouched();
  }
}
