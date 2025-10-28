import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  signal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-form-error',
  standalone: true,
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.scss'],
  imports: [CommonModule],
})
export class FormErrorComponent implements OnChanges {
  public message = input<string|null>('');
  public showIcon = input<boolean>(true);
  protected _visible = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    this._visible.set(!!this.message());
  }
}
