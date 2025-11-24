import { CommonModule, Location } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { finalize, Subscription } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { DividerComponent } from '../../../../shared/ui/divider/divider.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { SecureTextComponent } from '../../../../shared/ui/secure-text/secure-text.component';
import { SocialLoginComponent } from '../../../../shared/ui/social-login-button/social-login-button.component';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { CheckboxComponent } from '../../../../shared/ui/checkbox/checkbox.component';
import { AccountDeactivatedModalComponent } from '@app/shared/components/account-deactivated-modal/account-deactivated-modal.component';
interface LoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  remember: FormControl<boolean | null>;
}

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    SocialLoginComponent,
    DividerComponent,
    SecureTextComponent,
    InputComponent,
    SocialLoginComponent,
    AccountDeactivatedModalComponent, 
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
   showDeactivatedModal = signal<boolean>(false);
  protected form: FormGroup<LoginForm>;

  protected isPasswordHidden = signal(true);
  protected hasAttemptedSubmit = signal(false);
  protected isSubmitting = signal(false);
  protected loginError = signal<string | null>(null);
  protected loading: boolean = false;
  private subscription: Subscription = new Subscription();
  protected readonly APP_ROUTES = APP_ROUTES;

  private readonly emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly location: Location,
    private readonly notificationService: NotificationService
  ) {
    this.form = this.createForm();
  }
  ngOnInit(): void {
    this.subscription.add(
      this.authService.loading$.subscribe((isLoading) => {
        this.loading = isLoading;
      })
    );
  }

  private createForm(): FormGroup<LoginForm> {
    return this.fb.group({
      email: this.fb.control('', [
        Validators.required,
        Validators.pattern(this.emailRegex),
      ]),
      password: this.fb.control('', [Validators.required]),
      remember: this.fb.control(false),
    });
  }

  public hasFieldError(fieldName: keyof LoginForm): boolean {
    const field = this.form.get(fieldName);
    return !!(field?.invalid && (field.touched || this.hasAttemptedSubmit()));
  }

  public getFieldErrorMessage(fieldName: keyof LoginForm): string {
    const field = this.form.get(fieldName);
    if (!field?.errors) return '';

    if (field.errors['required'])
      return `${this.capitalize(fieldName)} is required`;

    if (field.errors['email'] || field.errors['pattern']) {
      if (fieldName === 'email') return 'Please enter a valid email address';
      if (fieldName === 'password')
        return 'Password must contain uppercase, lowercase, number, and special character';
    }

    if (field.errors['minlength'])
      return `${this.capitalize(fieldName)} must be at least ${
        field.errors['minlength']?.requiredLength
      } characters`;

    return '';
  }

  public togglePasswordVisibility(): void {
    this.isPasswordHidden.update((v) => !v);
  }

  handleSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.loginError.set(null);

    const email = this.form.value?.email ?? '';
    const password = this.form.value?.password ?? '';

    this.authService
      .login(email, password)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Credentials authenticated! Please provide the 2FA code sent to your email.'
          );
        },
        error: (err) => {
          if (err?.status === 401) {
            this.loginError.set('Invalid email or password.');
          } else if (err?.status === 403) {
            this.loginError.set('Access denied. Please verify your email.');
          } else {
            this.loginError.set('Login failed. Please try again.');
          }
        },
      });
  }

  private capitalize(text: string): string {
    return text?.charAt(0)?.toUpperCase() + text?.slice(1);
  }
  
  goBack(): void {
    this.router.navigate(['/']);
  }

   onCloseDeactivatedModal(): void {
    this.showDeactivatedModal.set(false);
  }
}

interface LoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  remember: FormControl<boolean | null>;
}
