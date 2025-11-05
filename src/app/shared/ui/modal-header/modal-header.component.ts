import { Component, Input, Output, EventEmitter } from '@angular/core';
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

  public onClose(): void {
    this.close.emit();
  }
}
