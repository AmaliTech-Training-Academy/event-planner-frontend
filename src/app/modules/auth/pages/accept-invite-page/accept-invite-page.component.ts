import { CommonModule } from '@angular/common';
import { Component, signal, OnInit, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'app-accept-invite-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    SecureTextComponent,
    InputComponent,
  ],
  templateUrl: './accept-invite-page.component.html',
  styleUrls: ['./accept-invite-page.component.scss'],
})
export class AcceptInvitePageComponent implements OnInit, OnDestroy {
  protected form: FormGroup<AcceptInviteForm>;

  protected hasAttemptedSubmit = signal(false);
  protected isSubmitting = signal(false);
  protected loading: boolean = false;
  protected inviteEmail = signal<string>('');
  protected inviteToken = signal<string>('');

  private subscription: Subscription = new Subscription();
  protected readonly APP_ROUTES = APP_ROUTES;

  private readonly passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly notificationService: NotificationService
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    // Get invite token and email from query params
    this.subscription.add(
      this.route.queryParams.subscribe((params) => {
        this.inviteToken.set(params['token'] || '');
        this.inviteEmail.set(params['email'] || '');
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

  handleSubmit(): void {
    this.hasAttemptedSubmit.set(true);
    this.form.markAllAsTouched();

    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const fullName = this.form.value?.fullName ?? '';
    const password = this.form.value?.password ?? '';
    const token = this.inviteToken();

    // Simulate API call with timeout (remove this and uncomment real API call when ready)
    setTimeout(() => {
      // Simulate success
      this.isSubmitting.set(false);
      this.notificationService.success(
        'Invite accepted successfully! You can now log in.'
      );
      this.router.navigate([APP_ROUTES.LOGIN]);
    }, 2000);

    // Real API call (currently commented out)
    // this.authService
    //   .acceptInvite(token, fullName, password)
    //   .subscribe({
    //     next: () => {
    //       this.isSubmitting.set(false);
    //       this.notificationService.success('Invite accepted successfully! You can now log in.');
    //       this.router.navigate([APP_ROUTES.LOGIN]);
    //     },
    //     error: (err) => {
    //       this.isSubmitting.set(false);
    //       if (err?.status === 400) {
    //         this.notificationService.error('Invalid or expired invitation link.');
    //       } else if (err?.status === 409) {
    //         this.notificationService.error('This invitation has already been accepted.');
    //       } else {
    //         this.notificationService.error('Failed to accept invite. Please try again.');
    //       }
    //     },
    //   });
  }

  private capitalize(text: string): string {
    return text?.charAt(0)?.toUpperCase() + text?.slice(1);
  }

  public hasFieldError(fieldName: keyof AcceptInviteForm): boolean {
    const field = this.form?.get(fieldName);
    return !!(field?.invalid && (field?.touched || this.hasAttemptedSubmit()));
  }

  public getFieldErrorMessage(fieldName: keyof AcceptInviteForm): string {
    const field = this.form?.get(fieldName);
    if (!field?.errors) {
      // Check form-level password mismatch error
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

  public isFieldValid(fieldName: keyof AcceptInviteForm): boolean {
    const field = this.form?.get(fieldName);
    return !!(field?.valid && field?.touched);
  }
}

interface AcceptInviteForm {
  fullName: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}
