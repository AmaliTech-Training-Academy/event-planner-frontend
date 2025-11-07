import {
  Component,
  EventEmitter,
  Output,
  input,
  signal,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { ModalHeaderComponent } from '../../../../../../shared/ui/modal-header/modal-header.component';

export interface SavedInvite {
  invitationTitle: string;
  eventId: string;
  event: string;
  createdBy: string;
  lastEdited: string;
  recipients: number;
}

@Component({
  selector: 'app-view-saved-invite',
  standalone: true,
  imports: [CommonModule, ModalHeaderComponent, ButtonComponent],
  templateUrl: './view-saved-invite-modal.component.html',
  styleUrls: ['./view-saved-invite-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewSavedInviteComponent {
  @Output() readonly close = new EventEmitter<void>();

  public readonly inviteData = input<SavedInvite>();

  public onClose(): void {
    this.close.emit();
  }

  public onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onClose();
    }
  }
}
