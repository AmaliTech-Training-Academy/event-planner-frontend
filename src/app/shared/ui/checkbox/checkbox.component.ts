import { Component, Input, Output, EventEmitter, signal } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent {
  @Input() label: string = '';
  @Input() checked: boolean = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  private _checked = signal<boolean>(this.checked);

  public get isChecked(): boolean {
    return this._checked();
  }

  public toggle(): void {
    this._checked.update((current) => !current);
    this.checkedChange.emit(this._checked());
  }
}
