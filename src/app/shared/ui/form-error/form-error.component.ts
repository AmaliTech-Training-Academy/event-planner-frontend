import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  signal,
  OnChanges,
} from '@angular/core';
@Component({
  selector: 'app-form-error',
  standalone: true,
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.scss'],
  imports: [CommonModule],
})
export class FormErrorComponent implements OnChanges {
  public message = input<string>('');
  public showIcon = input<boolean>(true);
  protected visible = signal<boolean>(false);

  ngOnChanges(): void {
    this.visible.set(!!this.message());
  }
}
