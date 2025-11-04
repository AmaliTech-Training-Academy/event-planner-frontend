import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
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
  @Input() public checked: boolean = false;
  @Input() public disabled: boolean = false;

  @Output() public checkedChange = new EventEmitter<boolean>();

  private _onChange: (value: boolean) => void = () => {};
  private _onTouched: () => void = () => {};

  public writeValue(value: boolean): void {
    this.checked = value ?? false;
  }

  public registerOnChange(fn: (value: boolean) => void): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.checked = input.checked;
    this._onChange(this.checked);
    this.checkedChange.emit(this.checked);
  }

  public onBlur(): void {
    this._onTouched();
  }
}
