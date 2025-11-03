import { Component, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { InputComponent } from '../../../../../../shared/ui/input/input.component';
import { FilterSelectComponent } from '../../../../../../shared/admin-ui/filter-select/filter-select.component';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { ModalHeaderComponent } from '../../../../../../shared/ui/modal-header/modal-header.component';
import { USER_ROLES } from '../../../../../../core/constants/user.constants';

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

  public readonly emailChips = signal<string[]>([]);
  public readonly emailInput = signal<string>('');

  public readonly inviteForm: FormGroup<InviteUserForm> = this._fb.group({
    title: this._fb.control('', [Validators.required]),
    name: this._fb.control('', [Validators.required]),
    email: this._fb.control(''),
    role: this._fb.control('', [Validators.required]),
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

  public addEmailChip(event: Event): void {
    const input = event.target as HTMLInputElement;
    const email = input.value.trim();

    if (
      email &&
      this._isValidEmail(email) &&
      !this.emailChips().includes(email)
    ) {
      this.emailChips.update((chips) => [...chips, email]);
      input.value = '';
      this.emailInput.set('');
    }
  }

  public onEmailKeyDown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const email = input.value.trim();

    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      if (
        email &&
        this._isValidEmail(email) &&
        !this.emailChips().includes(email)
      ) {
        this.emailChips.update((chips) => [...chips, email]);
        input.value = '';
        this.emailInput.set('');
      }
    } else if (
      event.key === 'Backspace' &&
      !email &&
      this.emailChips().length > 0
    ) {
      this.emailChips.update((chips) => chips.slice(0, -1));
    }
  }

  public removeEmailChip(email: string): void {
    this.emailChips.update((chips) => chips.filter((e) => e !== email));
  }

  private _isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  public onSubmit(): void {
    this.inviteForm.markAllAsTouched();

    if (this.emailChips().length === 0) {
      alert('Please add at least one email address');
      return;
    }

    if (this.inviteForm.invalid) return;

    console.log('Inviting users:', {
      ...this.inviteForm.value,
      emails: this.emailChips(),
    });

    this.success.emit();
  }

  public onCancel(): void {
    this.close.emit();
  }

  public hasError(controlName: keyof InviteUserForm): boolean {
    const control = this.inviteForm.get(controlName);
    return !!(control?.invalid && control?.touched);
  }

  public getErrorMessage(controlName: keyof InviteUserForm): string {
    const control = this.inviteForm.get(controlName);
    if (!control?.errors) return '';

    if (control.errors['required'])
      return `${this._capitalize(controlName)} is required`;
    if (control.errors['email'] || control.errors['invalidEmail'])
      return 'Please enter a valid email address';
    return 'Invalid input';
  }

  private _capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}

interface InviteUserForm {
  title: FormControl<string | null>;
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  role: FormControl<string | null>;
  event: FormControl<string | null>;
  message: FormControl<string | null>;
}
