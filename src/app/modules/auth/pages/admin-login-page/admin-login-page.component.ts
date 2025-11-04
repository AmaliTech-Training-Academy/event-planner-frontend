import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { SecureTextComponent } from '../../../../shared/ui/secure-text/secure-text.component';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { CheckboxComponent } from '../../../../shared/ui/checkbox/checkbox.component';
import { AuthService } from '../../../../core/services/auth.service';

interface LoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  rememberMe: FormControl<boolean | null>;
}

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    SecureTextComponent,
    ButtonComponent,
    CheckboxComponent,
    RouterLink,
    NgOptimizedImage,
  ],
  templateUrl: './admin-login-page.component.html',
  styleUrls: ['./admin-login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLoginPageComponent {
  public readonly loginForm: FormGroup<LoginForm>;
  protected readonly APP_ROUTES = APP_ROUTES;
  public readonly isSubmitting = signal<boolean>(false);

  private readonly _emailPattern: RegExp =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _authService: AuthService,
    private readonly _router: Router
  ) {
    this.loginForm = this._fb.group<LoginForm>({
      email: this._fb.control('', [
        Validators.required,
        Validators.pattern(this._emailPattern),
      ]),
      password: this._fb.control('', [Validators.required]),
      rememberMe: this._fb.control(false),
    });
  }

  public onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isSubmitting.set(true);

    const { email, password } = this.loginForm.value;

    this._authService.adminLogin(email!, password!).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this._router.navigate([APP_ROUTES.ADMIN_DASHBOARD]);
      },
      error: () => {
        this.isSubmitting.set(false);
      },
    });
  }

  public getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (control?.hasError('required')) {
      return `${this._capitalizeFirstLetter(field)} is required`;
    }
    if (control?.hasError('pattern')) {
      return 'Please enter a valid email';
    }
    return '';
  }

  private _capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
