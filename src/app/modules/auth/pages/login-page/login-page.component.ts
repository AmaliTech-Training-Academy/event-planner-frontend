import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { DividerComponent } from '../../../../shared/ui/divider/divider.component';
import { SecureTextComponent } from '../../../../shared/ui/secure-text/secure-text.component';
import { SocialLoginComponent } from '../../../../shared/ui/social-login-button/social-login-button.component';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { AuthService } from '../../../../core/services/auth.service';
import { tap, catchError, of } from 'rxjs';

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
    InputComponent,
    ButtonComponent,
    DividerComponent,
    SecureTextComponent,
    SocialLoginComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  protected form: FormGroup<LoginForm>;

  protected isPasswordHidden = signal(true);
  protected hasAttemptedSubmit = signal(false);
  protected isSubmitting = signal(false);
  protected loginError = signal<string | null>(null);

  protected readonly APP_ROUTES = APP_ROUTES;

  private readonly emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private readonly passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.form = this.createForm();
  }

  private createForm(): FormGroup<LoginForm> {
    return this.fb.group({
      email: this.fb.control('', [
        Validators.required,
        Validators.pattern(this.emailRegex),
      ]),
      password: this.fb.control('', [
        Validators.required,
        Validators.pattern(this.passwordRegex),
      ]),
      remember: this.fb.control(false),
    });
  }

  public togglePasswordVisibility(): void {
    this.isPasswordHidden.update((v) => !v);
  }

  public handleSubmit(): void {
    this.hasAttemptedSubmit.set(true);
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    this.loginError.set(null);

    const email = this.form.value.email ?? '';
    const password = this.form.value.password ?? '';

    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigate([APP_ROUTES.VERIFY_EMAIL], {
          state: { email },
        });
      },
      error: (err) => {
        this.loginError.set(
          err?.error?.message || 'Login failed. Please check your credentials.'
        );
        this.isSubmitting.set(false);
      },
      complete: () => this.isSubmitting.set(false),
    });
  }

  private capitalize(text: string): string {
    return text?.charAt(0)?.toUpperCase() + text?.slice(1);
  }

  public hasFieldError(fieldName: keyof LoginForm): boolean {
    const field = this.form?.get(fieldName);
    return !!(field?.invalid && (field?.touched || this.hasAttemptedSubmit()));
  }

  public getFieldErrorMessage(fieldName: keyof LoginForm): string {
    const field = this.form?.get(fieldName);
    if (!field?.errors) return '';

    const errors = field?.errors;
    switch (true) {
      case !!errors?.['required']:
        return `${this.capitalize(fieldName)} is required`;
      case !!errors?.['pattern'] && fieldName === 'email':
        return 'Please enter a valid email address';
      case !!errors?.['pattern'] && fieldName === 'password':
        return 'Password must include at least 8 chars, one number & one special character';
      default:
        return 'Invalid input';
    }
  }
}
