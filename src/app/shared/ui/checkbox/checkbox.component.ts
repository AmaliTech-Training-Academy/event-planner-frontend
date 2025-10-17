import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent {
  public label = input<string>('');
  public checked = input<boolean>(false);

  public checkedChange = output<boolean>();

  protected _checked = signal(this.checked());

  public get isChecked(): boolean {
    return this._checked();
  }

  public toggle(): void {
    this._checked.update((current) => !current);
    this.checkedChange.emit(this._checked());
  }
}
