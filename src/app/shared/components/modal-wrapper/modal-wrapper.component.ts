import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalHeaderComponent } from '../../../shared/ui/modal-header/modal-header.component'; 
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-modal-wrapper',
  standalone: true,
  imports: [CommonModule, ModalHeaderComponent, ButtonComponent],
  templateUrl: './modal-wrapper.component.html',
  styleUrls: ['./modal-wrapper.component.scss'] 
})
export class ModalWrapperComponent {
  @Input() title: string = '';
  @Input() primaryBtnLabel: string = 'Send Invite';
  @Input() secondaryBtnLabel: string = 'Save Progress';
  @Input() isSubmitDisabled: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() primaryAction = new EventEmitter<void>();
  @Output() secondaryAction = new EventEmitter<void>();

  onCancel() {
    this.close.emit();
  }
}