import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-form-error',
  standalone: true,
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.scss'],
  imports: [CommonModule],
})
export class FormErrorComponent {
  @Input() message: string = '';
  @Input() showIcon: boolean = true;

  _visible = signal(false);

  ngOnChanges() {
    this._visible.set(!!this.message);
  }
}
