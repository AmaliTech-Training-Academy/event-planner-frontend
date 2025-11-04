import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormsModule
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { AuthService } from '../../../../core/services/auth.service';
import { LogoComponent } from '../../components/logo/logo.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { FormErrorComponent } from '../../../../shared/ui/form-error/form-error.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { OtpInputComponent } from '../../../../shared/ui/otp-input/otp-input.component';

export function passwordMatchValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get(passwordField)?.value;
    const confirmPassword = formGroup.get(confirmPasswordField)?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    if (password !== confirmPassword) {
      formGroup.get(confirmPasswordField)?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (formGroup.get(confirmPasswordField)?.hasError('passwordMismatch')) {
        formGroup.get(confirmPasswordField)?.setErrors(null);
      }
    }
    return null;
  };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    LogoComponent,
    ButtonComponent,
    FormErrorComponent,
    InputComponent,
    OtpInputComponent
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  protected setPasswordForm!: FormGroup;
  protected isLoading: boolean = false;
  protected userEmail: string = 'Loading...';
  protected apiError: string | null = null;
 protected goBack(): void {
  this.router.navigate([APP_ROUTES.FORGOT_PASSWORD]);
}

  private routeSub: Subscription | null = null;
  private email: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) { }

  public ngOnInit(): void {
    this.routeSub = this.route.queryParamMap.subscribe(params => {
      this.email = params.get('email');
      this.userEmail = this.email || 'your-email@provider.com';
    });

    this.setPasswordForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: passwordMatchValidator('newPassword', 'confirmPassword')
    });
  }

  public ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  protected get controls() {
    return this.setPasswordForm.controls as { [key: string]: AbstractControl };
  }

  protected get passwordsMismatch(): boolean {
    return !!this.setPasswordForm.errors?.['passwordMismatch'];
  }

  protected get APP_ROUTES() {
    return APP_ROUTES;
  }


  protected onOtpChange(otp: string | any): void {
    const otpValue = (typeof otp === 'string') ? otp : (otp?.target?.value ?? String(otp));
    this.setPasswordForm.get('otp')?.setValue(otpValue);
    this.setPasswordForm.get('otp')?.markAsTouched();
  }

  protected onSubmit(): void {
    if (this.setPasswordForm.invalid) {
      this.setPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { otp, newPassword } = this.setPasswordForm.value;


    this.authService.resetPassword(otp, this.email ?? '', newPassword)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.router.navigate([APP_ROUTES.LOGIN]);
        },
        error: () => {
         
        }
      });
  }
}
