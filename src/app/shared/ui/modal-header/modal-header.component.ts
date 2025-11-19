import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-modal-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss'],
})
export class ModalHeaderComponent {
  @Input() title!: string;

  @Input() subtitle?: string;

  @Output() readonly close = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  protected onEscapeKey(): void {
    this.onClose();
  }

  public onClose(): void {
    this.close.emit();
  }
}
