import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormControl,
} from '@angular/forms';
import { InputComponent } from '../../../../../../shared/ui/input/input.component';
import { FilterSelectComponent } from '../../../../../../shared/admin-ui/filter-select/filter-select.component';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { USER_ROLES } from '../../../../../../core/constants/user.constants';
import { ModalHeaderComponent } from "../../../../../../shared/ui/modal-header/modal-header.component";

@Component({
  selector: 'app-invite-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    FilterSelectComponent,
    ButtonComponent,
    ModalHeaderComponent
],
  templateUrl: './invite-user-modal.component.html',
  styleUrls: ['./invite-user-modal.component.scss'],
})
export class InviteUserModalComponent {
  @Output() public readonly close = new EventEmitter<void>();

  private readonly _fb = inject(FormBuilder);

  /** ✅ Email Regex Validator */
  private static emailRegexValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const email = control.value?.trim();
    if (!email) return null;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) ? null : { invalidEmail: true };
  }

  /** ✅ Form Initialization */
  public readonly inviteForm: FormGroup<InviteUserForm> = this._fb.group({
    title: this._fb.control('', [Validators.required]),
    email: this._fb.control('', [
      Validators.required,
      Validators.email,
      InviteUserModalComponent.emailRegexValidator,
    ]),
    role: this._fb.control('', [Validators.required]),
    event: this._fb.control('', [Validators.required]),
    message: this._fb.control(''),
  });

  /** ✅ Select Options */
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

  /** ✅ Handle Form Submission */
  public onSubmit(): void {
    this.inviteForm.markAllAsTouched();

    if (this.inviteForm.invalid) return;

    console.log('Inviting user:', this.inviteForm.value);
    this.close.emit();
  }

  public onCancel(): void {
    this.close.emit();
  }

  /** ✅ Reusable Error Helpers */
  public hasError(controlName: keyof InviteUserForm): boolean {
    const control = this.inviteForm.get(controlName);
    return !!(control?.invalid && control?.touched);
  }

  public getErrorMessage(controlName: keyof InviteUserForm): string {
    const control = this.inviteForm.get(controlName);
    if (!control?.errors) return '';

    if (control.errors['required'])
      return `${this.capitalize(controlName)} is required`;
    if (control.errors['email'] || control.errors['invalidEmail'])
      return 'Please enter a valid email address';
    return 'Invalid input';
  }

  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}

/** ✅ Strongly Typed Form Interface */
interface InviteUserForm {
  title: FormControl<string | null>;
  email: FormControl<string | null>;
  role: FormControl<string | null>;
  event: FormControl<string | null>;
  message: FormControl<string | null>;
}
