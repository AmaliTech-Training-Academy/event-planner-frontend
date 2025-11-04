import { Component, OnInit, OnDestroy } from '@angular/core'; // Removed ViewChildren, ElementRef
import { CommonModule } from '@angular/common';

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
import { LogoComponent } from '../../components/logo/logo.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { FormErrorComponent } from '../../../../shared/ui/form-error/form-error.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { AuthService } from '../../../../core/services/auth.service';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';

// --- IMPORT YOUR REUSABLE OTP COMPONENT ---
import { OtpInputComponent } from '../../../../shared/ui/otp-input/otp-input.component'; 

export function passwordMatchValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get(passwordField)?.value;
    const confirmPassword = formGroup.get(confirmPasswordField)?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    if (password !== confirmPassword) {
      formGroup.get(confirmPasswordField)?.setErrors({ 'passwordMismatch': true });
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
    LogoComponent,
    ButtonComponent,
    FormErrorComponent,
    InputComponent,
    FormsModule,
    OtpInputComponent // --- ADDED IMPORT ---
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  // --- REMOVED MANUAL OTP LOGIC ---
  // @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;
  // protected digits: string[] = Array(6).fill(''); 
  // --- END REMOVED LOGIC ---

  protected setPasswordForm!: FormGroup;
  protected isLoading: boolean = false;
  protected userEmail: string = 'Loading...';
  protected apiError: string | null = null;

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
    return this.setPasswordForm.errors?.['passwordMismatch'] as boolean;
  }
  protected get APP_ROUTES() {
    return APP_ROUTES;
  }

  // --- START: NEW METHOD ---
  /**
   * Receives the OTP from the child component and updates the form control.
   */
  protected onOtpChange(otp: string): void {
    this.setPasswordForm.get('otp')?.setValue(otp);
    this.setPasswordForm.get('otp')?.markAsTouched(); // Mark as touched for validation
  }
  // --- END: NEW METHOD ---


  // --- REMOVED MANUAL OTP METHODS ---
  // protected onInput(...) {}
  // protected onKeyDown(...) {}
  // protected onPaste(...) {}
  // private updateOtpFormControl(...) {}
  // --- END REMOVED METHODS ---

  protected onSubmit(): void {

    if (this.setPasswordForm.invalid) {
      this.setPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const { otp, newPassword } = this.setPasswordForm.value;

    this.authService.resetPassword(otp, this.email!, newPassword)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: () => {
          this.router.navigate([APP_ROUTES.LOGIN]);
        }
        // Errors are handled by the AuthService
      });
  }
}