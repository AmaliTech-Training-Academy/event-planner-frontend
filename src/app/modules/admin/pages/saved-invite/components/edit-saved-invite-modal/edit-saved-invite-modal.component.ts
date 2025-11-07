import {
  Component,
  EventEmitter,
  Output,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalHeaderComponent } from '../../../../../../shared/ui/modal-header/modal-header.component';
import { InputComponent } from '../../../../../../shared/ui/input/input.component';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';

export interface SavedInvite {
  invitationTitle: string;
  eventId: string;
  event: string;
  createdBy: string;
  lastEdited: string;
  recipients: number;
}

@Component({
  selector: 'app-edit-saved-invite',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalHeaderComponent,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './edit-saved-invite-modal.component.html',
  styleUrls: ['./edit-saved-invite-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditSavedInviteComponent {
  @Output() public readonly close: EventEmitter<void> =
    new EventEmitter<void>();
  @Output() public readonly save: EventEmitter<SavedInvite> =
    new EventEmitter<SavedInvite>();

  private _inviteData?: SavedInvite;

  @Input()
  public set inviteData(value: SavedInvite | undefined) {
    this._inviteData = value;
    if (value) {
      this.inviteForm.patchValue(value, { emitEvent: false });
      this.inviteForm.markAsPristine();
      this.inviteForm.markAsUntouched();
    }
  }
  public get inviteData(): SavedInvite | undefined {
    return this._inviteData;
  }

  public readonly inviteForm: FormGroup;

  private readonly _fieldLabels: Record<string, string> = {
    invitationTitle: 'Invitation Title',
    eventId: 'Event ID',
    event: 'Event',
    createdBy: 'Created By',
    recipients: 'Recipients',
  };

  constructor(private readonly _fb: FormBuilder) {
    this.inviteForm = this._fb.group({
      invitationTitle: ['', Validators.required],
      eventId: ['', Validators.required],
      event: ['', Validators.required],
      createdBy: ['', Validators.required],
      lastEdited: [''],
      recipients: [0, [Validators.required, Validators.min(1)]],
    });
  }

  public getErrorMessage(fieldName: string): string | null {
    const field = this.inviteForm.get(fieldName);
    if (!(field?.dirty || field?.touched)) return null;

    const label = this._fieldLabels[fieldName] ?? fieldName;

    if (field.hasError('required')) return `${label} is required`;
    if (field.hasError('min')) return `${label} must be greater than 0`;

    return 'Invalid value';
  }

  public onSubmit(): void {
    if (this.inviteForm.valid) {
      const updatedInvite: SavedInvite = {
        ...this.inviteForm.value,
        lastEdited: new Date().toISOString().split('T')[0],
      };
      this.save.emit(updatedInvite);
    }
  }

  public onCancel(): void {
    this.close.emit();
  }

  public onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement)?.classList.contains('modal-backdrop')) {
      this.onCancel();
    }
  }
}
