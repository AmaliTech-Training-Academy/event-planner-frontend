import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-account-deactivated-modal',
  imports: [CommonModule, ButtonComponent, NgOptimizedImage],
  templateUrl: './account-deactivated-modal.component.html',
  styleUrl: './account-deactivated-modal.component.scss'
})
export class AccountDeactivatedModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() contactSupport = new EventEmitter<void>();
  
  isVisible = true;

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    this.closeModal();
  }

  onContactSupport(): void {
    this.contactSupport.emit();
    
    window.location.href = 'mailto:support@eventhub.com';
  }

  onGoBack(): void {
    this.closeModal();
  }

  onClose(): void {
    this.closeModal();
  }

  onOverlayClick(event: MouseEvent): void {
    
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  private closeModal(): void {
    this.isVisible = false;
    this.close.emit();
  }
}