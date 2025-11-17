import { Component, Output, EventEmitter, inject, OnInit } from '@angular/core';
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
  private readonly userManagementService = inject(UserManagementService);

  public readonly inviteForm: FormGroup = this._fb.group({
    title: this._fb.control('', [Validators.required]),
    users: this._fb.array([this._createUserFormGroup()]),
    event: this._fb.control('', [Validators.required]), // Stored as string in form
    message: this._fb.control(''),
  });

  public readonly roles = [
    { label: 'Organizer', value: USER_ROLES.ORGANIZER },
    { label: 'Co-Organizer', value: USER_ROLES.CO_ORGANIZER },
    { label: 'Attendee', value: USER_ROLES.ATTENDEE },
    { label: 'Admin', value: USER_ROLES.ADMIN },
  ];

  // ✅ Events with STRING values for the dropdown
  public events: { label: string; value: string }[] = [];

  public invitations: Invitation[] = [];
  public isSubmitting = false;

  ngOnInit(): void {
    this.loadInvitations();
    this.loadEvents();
  }

  private loadInvitations(): void {
    this.userManagementService.fetchInvitations().subscribe({
      next: (invitations) => {
        this.invitations = invitations;
        console.log('📥 Fetched Invitations:', invitations);
      },
      error: (err) => {
        console.error('❌ Failed to load invitations:', err);
        this.invitations = [];
      },
    });
  }

  private loadEvents(): void {
    // TODO: Replace with your actual event service
    // this.eventService.getAllEvents().subscribe({
    //   next: (response) => {
    //     this.events = response.data.map(event => ({
    //       label: event.eventName,
    //       value: event.eventId.toString() // Convert to string for dropdown
    //     }));
    //   },
    //   error: (err) => {
    //     console.error('❌ Failed to load events:', err);
    //     this.events = [];
    //   }
    // });

    // Temporary placeholder with STRING values for dropdown
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
      console.warn('⚠️ Invalid invite form:', this.inviteForm.value);
      alert('Please fill in all required fields');
      return;
    }

    // ✅ Convert event from string to number for backend
    const payload: InviteUserPayload = {
      invitationTitle: this.inviteForm.value.title,
      invitees: this.users.value.map((user: any) => ({
        inviteeName: user.name,
        inviteeEmail: user.email,
        role: user.role,
      })),
      event: parseInt(this.inviteForm.value.event, 10), // Convert string to number
      status: 'SAVE',
      message: this.inviteForm.value.message || '',
    };

    console.log('📤 Sending invitation payload:', payload);

    this.isSubmitting = true;

    this.userManagementService.inviteUsers(payload).subscribe({
      next: (response) => {
        console.log('✅ Invitation Response:', response);
        alert(`✅ Invitations sent successfully!`);
        this.success.emit();
        this.close.emit();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('❌ Invitation Error:', err);
        const errorMessage =
          err?.error?.description ||
          err?.error?.message ||
          err?.message ||
          'Failed to send invitations. Please try again.';
        alert(errorMessage);
        this.isSubmitting = false;
      },
    });
  }

  public onSaveProgress(): void {
    console.log('💾 Saving progress:', this.inviteForm.value);
    // TODO: Implement save as draft functionality
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
