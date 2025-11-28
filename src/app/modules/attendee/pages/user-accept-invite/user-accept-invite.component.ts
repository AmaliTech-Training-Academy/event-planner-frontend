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
 
  
  
  private readonly passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  constructor() {
    this.form = this.createForm();
  }

  ngOnInit(): void {
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

    if (this.form.invalid) {
      this.notificationService.error('Please fix the errors in the form before submitting.');
      return;
    }

    if (this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const fullName = this.form.value.fullName ?? '';
    const invitationCode = this.inviteToken();
    const password = this.form.value.password ?? '';

    this.subscription.add(
      this.authService
        .acceptEventInvitation(fullName, invitationCode, password)
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
    const fieldInvalid = field?.invalid && (field?.touched || this.hasAttemptedSubmit());
    
   
    if (fieldName === 'confirmPassword') {
      const hasPasswordMismatch = this.form.errors?.['passwordMismatch'] && 
                                   (field?.touched || this.hasAttemptedSubmit());
      return !!(fieldInvalid || hasPasswordMismatch);
    }
    
    return !!fieldInvalid;
  }

  protected getFieldErrorMessage(fieldName: keyof AcceptInviteForm): string {
    const field = this.form?.get(fieldName);
    
    
    if (fieldName === 'confirmPassword') {
      if (this.form.errors?.['passwordMismatch'] && (field?.touched || this.hasAttemptedSubmit())) {
        return 'Passwords do not match';
      }
    }

    if (!field?.errors) {
      return '';
    }

    const errors = field.errors;
    
    
    if (errors['required']) {
      const fieldLabel = this.getFieldLabel(fieldName);
      return `${fieldLabel} is required`;
    }
    
    
    if (errors['noEmail'] && fieldName === 'fullName') {
      return 'Please enter your full name, not an email address';
    }
    
   
    if (errors['pattern'] && fieldName === 'password') {
      return 'Password must be at least 8 characters with one letter, one number, and one special character';
    }

    return 'Invalid input';
  }

  protected isFieldValid(fieldName: keyof AcceptInviteForm): boolean {
    const field = this.form?.get(fieldName);
    
    
    if (fieldName === 'confirmPassword' && this.form.errors?.['passwordMismatch']) {
      return false;
    }
    
    return !!(field?.valid && field?.touched);
  }

  private getFieldLabel(fieldName: keyof AcceptInviteForm): string {
    const labels: Record<keyof AcceptInviteForm, string> = {
      fullName: 'Full name',
      password: 'Password',
      confirmPassword: 'Confirm password'
    };
    return labels[fieldName];
  }

  private createForm(): FormGroup<AcceptInviteForm> {
    return this.fb.group(
      {
        fullName: this.fb.control('', [
          Validators.required,
          this.noEmailValidator,
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


  private noEmailValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const hasAtSymbol = control.value.includes('@');
    return hasAtSymbol ? { noEmail: true } : null;
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