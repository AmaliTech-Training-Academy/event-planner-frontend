import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.scss'],
})
export class SuccessModalComponent {
  @Output() public readonly close = new EventEmitter<void>();
  @Output() public readonly action = new EventEmitter<void>();

  public onClose(): void {
    this.close.emit();
  }

  public onAction(): void {
    this.action.emit();
  }
}
