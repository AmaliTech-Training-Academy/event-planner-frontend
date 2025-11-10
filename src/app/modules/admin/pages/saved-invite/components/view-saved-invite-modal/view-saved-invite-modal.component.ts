import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { ModalHeaderComponent } from '../../../../../../shared/ui/modal-header/modal-header.component';

export interface SavedInvite {
  readonly invitationTitle: string;
  readonly eventId: string;
  readonly event: string;
  readonly createdBy: string;
  readonly lastEdited: string;
  readonly recipients: number;
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
  public readonly inviteData = input<SavedInvite>();
  public readonly close = output<void>();

  protected onClose(): void {
    this.close.emit();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (this._isBackdropClick(event)) {
      this.onClose();
    }
  }

  private _isBackdropClick(event: MouseEvent): boolean {
    return (event.target as HTMLElement)?.classList.contains('modal-backdrop');
  }
}
