import { Component, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../ui/button/button.component";
import { ModalHeaderComponent } from "../../ui/modal-header/modal-header.component";

@Component({
  selector: 'app-logout-confirmation-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ModalHeaderComponent],
  templateUrl: './logout-confirmation-modal.component.html',
  styleUrls: ['./logout-confirmation-modal.component.scss'],
})
export class LogoutConfirmationModalComponent {
  // Input for controlling modal visibility
  isOpen = input.required<boolean>();

  // Output events
  confirm = output<void>();
  cancel = output<void>();

  protected onConfirm(): void {
    this.confirm.emit();
  }

  protected onCancel(): void {
    this.cancel.emit();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
