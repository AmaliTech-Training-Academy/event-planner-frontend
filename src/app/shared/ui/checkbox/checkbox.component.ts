import {
  Component,
  input,
  output,
  signal,
  effect,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
} from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent {
  public label = input<string>('');
  public checked = input<boolean>(false);

  public ariaLabel = input<string>('');

  public checkedChange = output<boolean>();

  private _checked = signal<boolean>(false);
  private _disabled = signal<boolean>(false);

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      this._checked.set(this.checked());
    });
  }

  public get isChecked(): boolean {
    return this._checked();
  }

  public get isDisabled(): boolean {
    return this._disabled();
  }

  writeValue(value: boolean): void {
    this._checked.set(value ?? false);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  public toggleCheck(): void {
    if (this._disabled()) return;
    const newValue = !this._checked();
    this._checked.set(newValue);
    this.onChange(newValue);
    this.onTouched();
    this.checkedChange.emit(newValue);
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Space' || event.key === ' ') {
      event.preventDefault();
      this.toggleCheck();
    }
  }
}
