import { Component, input, output, signal, effect } from '@angular/core';

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

  protected _checked = signal(this.checked());

  constructor() {
    // Keep internal state in sync with external input()
    effect(() => {
      this._checked.set(this.checked());
    });
  }

  public get isChecked(): boolean {
    return this._checked();
  }

  public toggle(): void {
    this._checked.update((current) => !current);
    this.checkedChange.emit(this._checked());
  }
}
