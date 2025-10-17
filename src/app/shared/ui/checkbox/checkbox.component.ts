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

  _checked = signal(this.checked);

  toggle() {
    this._checked.update((v) => !v);
    this.checkedChange.emit(this._checked());
  }
}
