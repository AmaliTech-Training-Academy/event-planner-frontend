import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent {
  label = input<string>('');
  checked = input<boolean>(false);

  checkedChange = output<boolean>();

  public _checked = signal(this.checked());

  get isChecked(): boolean {
    return this._checked();
  }

  toggle(): void {
    this._checked.update((current) => !current);
    this.checkedChange.emit(this._checked());
  }
}
