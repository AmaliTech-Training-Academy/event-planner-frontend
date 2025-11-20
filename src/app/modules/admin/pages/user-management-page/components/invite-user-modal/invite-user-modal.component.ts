import { Component, Output, EventEmitter, inject, OnInit, signal } from '@angular/core';
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
import { Invitation, InviteUserPayload } from '../../../../../../core/models';


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
export class InviteUserModalComponent implements OnInit {
  @Output() public readonly close = new EventEmitter<void>();
  @Output() public readonly success = new EventEmitter<void>();

  private readonly _fb = inject(FormBuilder);
  private readonly _userManagementService = inject(UserManagementService);

  protected readonly inviteForm: FormGroup = this._fb.group({
    title: this._fb.control('', [Validators.required]),
    users: this._fb.array([this._createUserFormGroup()]),
    event: this._fb.control('', [Validators.required]),
    message: this._fb.control(''),
  });

  protected readonly roles = [
    { label: 'Organizer', value: USER_ROLES.ORGANIZER },
    { label: 'Co-Organizer', value: USER_ROLES.CO_ORGANIZER },
    { label: 'Attendee', value: USER_ROLES.ATTENDEE },
    { label: 'Admin', value: USER_ROLES.ADMIN },
  ];

  protected events: { label: string; value: string }[] = [];
  protected invitations: Invitation[] = [];
  protected readonly isSubmitting = signal(false);

  ngOnInit(): void {
    this._loadEvents();
  }

  private _loadEvents(): void {
    this.events = [
      { label: 'Tech Conference 2025', value: '12' },
      { label: 'Annual Meetup', value: '13' },
      { label: 'Workshop Series', value: '14' },
    ];
  }

  private _createUserFormGroup(): FormGroup {
    return this._fb.group({
      name: this._fb.control('', [Validators.required]),
      email: this._fb.control('', [Validators.required, Validators.email]),
      role: this._fb.control('', [Validators.required]),
    });
  }

  protected get users(): FormArray {
    return this.inviteForm.get('users') as FormArray;
  }

  protected addUser(): void {
    this.users.push(this._createUserFormGroup());
  }

  protected removeUser(index: number): void {
    if (this.users.length > 1) {
      this.users.removeAt(index);
    }
  }

  protected onSubmit(): void {
    this.inviteForm.markAllAsTouched();

    if (this.inviteForm.invalid) {
      return;
    }

    const payload: InviteUserPayload = {
      invitationTitle: this.inviteForm.value.title,
      invitees: this.users.value.map((user: any) => ({
        inviteeName: user.name,
        inviteeEmail: user.email,
        role: user.role,
      })),
      event: parseInt(this.inviteForm.value.event, 10),
      status: 'SAVE',
      message: this.inviteForm.value.message || '',
    };

    this.isSubmitting.set(true);

    this._userManagementService.inviteUsers(payload).subscribe({
      next: (response) => {
        this.success.emit();
        this.close.emit();
        this.isSubmitting.set(false);
      },
      error: (err) => {
        const errorMessage =
          err?.error?.description ||
          err?.error?.message ||
          err?.message ||
          'Failed to send invitations. Please try again.';
        alert(errorMessage);
        this.isSubmitting.set(false);
      },
    });
  }

  protected onSaveProgress(): void {

  }

  protected onCancel(): void {
    this.close.emit();
  }

  protected hasError(controlName: string): boolean {
    const control = this.inviteForm.get(controlName);
    return !!(control?.invalid && control?.touched);
  }

  protected hasUserFieldError(userIndex: number, fieldName: string): boolean {
    const control = this.users.at(userIndex).get(fieldName);
    return !!(control?.invalid && control?.touched);
  }

  protected getErrorMessage(controlName: string): string {
    const control = this.inviteForm.get(controlName);
    if (!control?.errors) return '';

    if (control.errors['required'])
      return `${this._capitalize(controlName)} is required`;
    return 'Invalid input';
  }

  protected getUserFieldErrorMessage(
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
