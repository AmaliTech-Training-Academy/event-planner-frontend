import { CommonModule } from '@angular/common';
import { Component, signal, inject, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../../shared/ui/input/input.component';
import { SecureTextComponent } from '../../../../../shared/ui/secure-text/secure-text.component';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ModalHeaderComponent } from '@app/shared/ui/modal-header/modal-header.component';

interface AddTeamMemberForm {
  fullName: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

export interface TeamMemberPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-add-team-member',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    SecureTextComponent,
    InputComponent,
    ModalHeaderComponent
  ],
  templateUrl: './add-team-member.component.html',
  styleUrls: ['./add-team-member.component.scss'],
})
export class AddTeamMemberModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationService);

  protected readonly form: FormGroup<AddTeamMemberForm>;
  protected readonly hasAttemptedSubmit = signal(false);
  protected readonly isSubmitting = signal(false);

  // Output events
  readonly close = output<void>();
  readonly submit = output<TeamMemberPayload>();

  private readonly passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  constructor() {
    this.form = this.createForm();
  }

  protected handleSubmit(): void {
    this.hasAttemptedSubmit.set(true);
    this.form.markAllAsTouched();

    if (this.form.invalid || this.isSubmitting()) return;

    const payload: TeamMemberPayload = {
      fullName: this.form.value.fullName ?? '',
      email: this.form.value.email ?? '',
      password: this.form.value.password ?? '',
      confirmPassword: this.form.value.confirmPassword ?? '',
    };

    this.submit.emit(payload);
  }

  protected handleCancel(): void {
    this.close.emit();
  }

  protected hasFieldError(fieldName: keyof AddTeamMemberForm): boolean {
    const field = this.form?.get(fieldName);
    return !!(field?.invalid && (field?.touched || this.hasAttemptedSubmit()));
  }

  protected getFieldErrorMessage(fieldName: keyof AddTeamMemberForm): string {
    const field = this.form?.get(fieldName);
    if (!field?.errors) {
      if (
        fieldName === 'confirmPassword' &&
        this.form.errors?.['passwordMismatch']
      ) {
        return 'Passwords do not match';
      }
      return '';
    }

    const errors = field.errors;
    switch (true) {
      case !!errors?.['required']:
        return `${this.capitalize(
          fieldName.replace(/([A-Z])/g, ' $1').trim()
        )} is required`;
      case !!errors?.['minLength'] && fieldName === 'fullName':
        return 'Full name must be at least 2 characters';
      case !!errors?.['email']:
        return 'Please enter a valid email address';
      case !!errors?.['pattern'] && fieldName === 'password':
        return 'Password must include at least 8 chars, one number & one special character';
      default:
        return 'Invalid input';
    }
  }

  protected isFieldValid(fieldName: keyof AddTeamMemberForm): boolean {
    const field = this.form?.get(fieldName);
    return !!(field?.valid && field?.touched);
  }

  private createForm(): FormGroup<AddTeamMemberForm> {
    return this.fb.group(
      {
        fullName: this.fb.control('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        email: this.fb.control('', [Validators.required, Validators.email]),
        password: this.fb.control('', [
          Validators.required,
          Validators.pattern(this.passwordRegex),
        ]),
        confirmPassword: this.fb.control('', [Validators.required]),
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  private passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (confirmPassword.value === '') {
      return null;
    }

    return password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  private capitalize(text: string): string {
    return text?.charAt(0)?.toUpperCase() + text?.slice(1);
  }

  public setSubmitting(isSubmitting: boolean): void {
    this.isSubmitting.set(isSubmitting);
  }
  public onCancel(): void {
    this.close.emit();
  }
}
