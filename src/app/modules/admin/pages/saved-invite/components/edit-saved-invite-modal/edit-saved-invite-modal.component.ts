import {
  Component,
  input,
  output,
  effect,
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
  readonly invitationTitle: string;
  readonly eventId: string;
  readonly event: string;
  readonly createdBy: string;
  readonly lastEdited: string;
  readonly recipients: number;
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
  public readonly inviteData = input<SavedInvite>();
  public readonly close = output<void>();
  public readonly save = output<SavedInvite>();

  protected readonly inviteForm: FormGroup;

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

    effect(() => {
      const data: SavedInvite | undefined = this.inviteData();
      if (data) {
        this.inviteForm.patchValue(data, { emitEvent: false });
        this.inviteForm.markAsPristine();
        this.inviteForm.markAsUntouched();
      }
    });
  }

  protected getErrorMessage(fieldName: string): string | null {
    const field = this.inviteForm.get(fieldName);
    if (!(field?.dirty || field?.touched)) {
      return null;
    }

    const label: string = this._fieldLabels[fieldName] ?? fieldName;

    if (field.hasError('required')) {
      return `${label} is required`;
    }
    if (field.hasError('min')) {
      return `${label} must be greater than 0`;
    }

    return 'Invalid value';
  }

  protected onSubmit(): void {
    if (this.inviteForm.valid) {
      const updatedInvite: SavedInvite = {
        ...this.inviteForm.value,
        lastEdited: new Date().toISOString().split('T')[0],
      };
      this.save.emit(updatedInvite);
    }
  }

  protected onCancel(): void {
    this.close.emit();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (this._isBackdropClick(event)) {
      this.onCancel();
    }
  }

  private _isBackdropClick(event: MouseEvent): boolean {
    return (event.target as HTMLElement)?.classList.contains('modal-backdrop');
  }
}
