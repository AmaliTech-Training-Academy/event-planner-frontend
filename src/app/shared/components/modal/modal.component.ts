import {
  Component,
  output,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  public readonly closeModal = output<void>();

  // We no longer need the ViewChild or the complex logic

  /**
   * This method is now only called when the backdrop itself is clicked.
   */
  protected onBackdropClick(): void {
    this.closeModal.emit();
  }
}

