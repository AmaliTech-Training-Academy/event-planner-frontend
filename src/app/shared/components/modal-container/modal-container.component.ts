import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal-container',
  imports: [],
  templateUrl: './modal-container.component.html',
  styleUrl: './modal-container.component.scss'
})
export class ModalContainerComponent {

  @Output() close = new EventEmitter<void>();
  @ViewChild('modalContent', { static: true }) modalContent!: ElementRef;

  protected closeModal() {
    this.close.emit();
  }

  @HostListener('document:click', ['$event'])
  protected handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-container')) {
      this.closeModal();
    }
  }

}
