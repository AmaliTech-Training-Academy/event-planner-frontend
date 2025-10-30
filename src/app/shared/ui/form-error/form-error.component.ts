import { CommonModule, NgOptimizedImage } from '@angular/common';
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
  imports: [CommonModule, NgOptimizedImage],
})
export class FormErrorComponent implements OnChanges {
  public message = input<string>('');
  public showIcon = input<boolean>(true);
  public visible = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    this.visible.set(!!this.message());
  }
}
