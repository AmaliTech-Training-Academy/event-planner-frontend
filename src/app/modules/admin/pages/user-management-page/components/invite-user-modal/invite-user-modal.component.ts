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
import { InviteUserPayload } from '../../../../../../core/models';

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
    users: this._fb.array([this._createUserFormGroup()]),
    message: this._fb.control(''),
  });

  public readonly roles = [
    { label: 'Attendee', value: USER_ROLES.ATTENDEE },
    { label: 'Co-Organizer', value: USER_ROLES.CO_ORGANIZER },
    { label: 'Admin', value: USER_ROLES.ADMIN },
  ];

  public isSubmitting = false;
  public isSaving = false;

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

  /**
   * Send invitation - status: 'SEND'
   */
  public onSubmit(): void {
    this.inviteForm.markAllAsTouched();

    if (this.inviteForm.invalid) {
      return;
    }

    const payload: InviteUserPayload = {
      invitees: this.users.value.map((user: any) => ({
        fullName: user.name,
        email: user.email,
        role: user.role,
      })),
      message: this.inviteForm.value.message || '',
      status: 'SEND',
    };

    this.isSubmitting = true;

    this.userManagementService.inviteUsers(payload).subscribe({
      next: () => {
        this.success.emit();
        this.close.emit();
      },
      error: () => {
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  /**
   * Save as draft - status: 'SAVE'
   */
  public onSaveProgress(): void {
    this.inviteForm.markAllAsTouched();

    if (this.inviteForm.invalid) {
      return;
    }

    const payload: InviteUserPayload = {
      invitees: this.users.value.map((user: any) => ({
        fullName: user.name,
        email: user.email,
        role: user.role,
      })),
      message: this.inviteForm.value.message || '',
      status: 'SAVE',
    };

    this.isSaving = true;

    this.userManagementService.inviteUsers(payload).subscribe({
      next: () => {
        // Optionally show success message for draft saved
        this.success.emit();
        this.close.emit();
      },
      error: () => {
        this.isSaving = false;
      },
      complete: () => {
        this.isSaving = false;
      },
    });
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
