import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { InputComponent } from '../../../../../../shared/ui/input/input.component';
import { FilterSelectComponent } from '../../../../../../shared/admin-ui/filter-select/filter-select.component';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { ModalHeaderComponent } from '../../../../../../shared/ui/modal-header/modal-header.component';
import { USER_ROLES } from '../../../../../../core/constants/user.constants';
import { UserManagementService } from '../../../../../../core/services/user-management.service';
import { InviteUserPayload } from '../../../../../../core/models/user.model';

@Component({
  selector: 'app-invite-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    FilterSelectComponent,
    ButtonComponent,
    ModalHeaderComponent,
  ],
  templateUrl: './invite-user-modal.component.html',
  styleUrls: ['./invite-user-modal.component.scss'],
})
export class InviteUserModalComponent {
  @Output() public readonly close = new EventEmitter<void>();
  @Output() public readonly success = new EventEmitter<void>();

  private readonly _fb = inject(FormBuilder);
  private readonly userManagementService = inject(UserManagementService);

  public readonly inviteForm: FormGroup = this._fb.group({
    title: this._fb.control('', [Validators.required]),
    users: this._fb.array([this._createUserFormGroup()]),
    event: this._fb.control('', [Validators.required]),
    message: this._fb.control(''),
  });

  public readonly roles = [
    { label: USER_ROLES.ORGANIZER, value: USER_ROLES.ORGANIZER },
    { label: USER_ROLES.CO_ORGANIZER, value: USER_ROLES.CO_ORGANIZER },
    { label: USER_ROLES.ATTENDEE, value: USER_ROLES.ATTENDEE },
    { label: USER_ROLES.VENUE_STAFF, value: USER_ROLES.VENUE_STAFF },
    { label: USER_ROLES.ADMIN, value: USER_ROLES.ADMIN },
  ];

  public readonly events = [
    { label: 'Tech Conference 2025', value: 'tech_conf_2025' },
    { label: 'Music Fest 2025', value: 'music_fest_2025' },
    { label: 'Startup Pitch Night', value: 'startup_pitch' },
    { label: 'Community Meetup', value: 'community_meetup' },
  ];

  public isSubmitting = false;

  private _createUserFormGroup(): FormGroup {
    return this._fb.group({
      name: this._fb.control('', [Validators.required]),
      email: this._fb.control('', [Validators.required, Validators.email]),
      role: this._fb.control('', [Validators.required]),
    });
  }

  public get users(): FormArray {
    return this.inviteForm.get('users') as FormArray;
  }

  public addUser(): void {
    this.users.push(this._createUserFormGroup());
  }

  public removeUser(index: number): void {
    if (this.users.length > 1) {
      this.users.removeAt(index);
    }
  }

  public onSubmit(): void {
    this.inviteForm.markAllAsTouched();

    if (this.inviteForm.invalid) {
      alert('Please fill in all required fields');
      return;
    }

    this.isSubmitting = true;

    const payload: InviteUserPayload = {
      invitationTitle: this.inviteForm.value.title,
      invitees: this.users.value.map((user: any) => ({
        inviteeName: user.name,
        inviteeEmail: user.email,
        role: user.role,
      })),
      event: this.inviteForm.value.event,
      status: 'SAVE', // or 'SEND' if you have two modes
      message: this.inviteForm.value.message || '',
    };

    console.log('Sending invitation payload:', payload);

    this.userManagementService.inviteUsers(payload).subscribe({
      next: (response) => {
        console.log('Invitations sent successfully:', response.data);
        alert(`Invitations processed successfully.`);
        this.success.emit();
        this.close.emit();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Failed to send invitations:', err);
        alert('Failed to send invitations. Please try again.');
        this.isSubmitting = false;
      },
    });
  }

  public onSaveProgress(): void {
    console.log('Saving progress:', this.inviteForm.value);
  }

  public onCancel(): void {
    this.close.emit();
  }

  public hasError(controlName: string): boolean {
    const control = this.inviteForm.get(controlName);
    return !!(control?.invalid && control?.touched);
  }

  public hasUserFieldError(userIndex: number, fieldName: string): boolean {
    const control = this.users.at(userIndex).get(fieldName);
    return !!(control?.invalid && control?.touched);
  }

  public getErrorMessage(controlName: string): string {
    const control = this.inviteForm.get(controlName);
    if (!control?.errors) return '';

    if (control.errors['required'])
      return `${this._capitalize(controlName)} is required`;
    return 'Invalid input';
  }

  public getUserFieldErrorMessage(
    userIndex: number,
    fieldName: string
  ): string {
    const control = this.users.at(userIndex).get(fieldName);
    if (!control?.errors) return '';

    if (control.errors['required'])
      return `${this._capitalize(fieldName)} is required`;
    if (control.errors['email']) return 'Please enter a valid email address';
    return 'Invalid input';
  }

  private _capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
