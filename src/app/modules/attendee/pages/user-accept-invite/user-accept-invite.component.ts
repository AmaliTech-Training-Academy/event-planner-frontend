import { CommonModule } from '@angular/common';
import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

// Ensure these paths match your project structure
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { SecureTextComponent } from '../../../../shared/ui/secure-text/secure-text.component';
import { NotificationService } from '../../../../core/services/notification.service';

interface AcceptInviteForm {
  fullName: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

@Component({
  selector: 'app-user-accept-invite',
  standalone: true, // Explicitly marking as standalone since you use imports
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    SecureTextComponent,
    InputComponent,
  ],
  templateUrl: './user-accept-invite.component.html',
  styleUrl: './user-accept-invite.component.scss',
})
export class UserAcceptInviteComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notificationService = inject(NotificationService);

  protected readonly form: FormGroup<AcceptInviteForm>;
  protected readonly hasAttemptedSubmit = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly inviteToken = signal<string>('');
  protected readonly APP_ROUTES = APP_ROUTES;

  protected loading = false;

  private readonly subscription = new Subscription();
  // Password regex: At least 8 chars, 1 number, 1 special char
  private readonly passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  constructor() {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    // Extract token from URL query params (e.g., ?token=...)
    this.subscription.add(
      this.route.queryParams.subscribe((params) => {
        this.inviteToken.set(params['token'] || '');
      })
    );

    this.subscription.add(
      this.authService.loading$.subscribe((isLoading) => {
        this.loading = isLoading;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected handleSubmit(): void {
  this.hasAttemptedSubmit.set(true);
  this.form.markAllAsTouched();

  if (this.form.invalid || this.isSubmitting()) return;

  this.isSubmitting.set(true);

  const fullName = this.form.value.fullName ?? '';
  const invitationCode = this.inviteToken();
  const password = this.form.value.password ?? '';

  this.subscription.add(
    this.authService
      .acceptEventInvitation(fullName, invitationCode, password) // Changed this line
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.notificationService.success(
            'Invitation accepted successfully! You can now log in.'
          );
          this.router.navigate([APP_ROUTES.LOGIN]);
        },
        error: (error) => {
          this.isSubmitting.set(false);
          this.notificationService.error(
            error?.error?.message ||
              'Failed to accept invitation. Please try again.'
          );
        },
      })
  );
}

  protected hasFieldError(fieldName: keyof AcceptInviteForm): boolean {
    const field = this.form?.get(fieldName);
    return !!(field?.invalid && (field?.touched || this.hasAttemptedSubmit()));
  }

  protected getFieldErrorMessage(fieldName: keyof AcceptInviteForm): string {
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
      case !!errors?.['pattern'] && fieldName === 'password':
        return 'Password must include at least 8 chars, one number & one special character';
      default:
        return 'Invalid input';
    }
  }

  protected isFieldValid(fieldName: keyof AcceptInviteForm): boolean {
    const field = this.form?.get(fieldName);
    return !!(field?.valid && field?.touched);
  }

  private createForm(): FormGroup<AcceptInviteForm> {
    return this.fb.group(
      {
        fullName: this.fb.control('', [
          Validators.required,
          Validators.minLength(2),
        ]),
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
}