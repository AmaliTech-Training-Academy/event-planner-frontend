import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { FormErrorComponent } from '../../../../shared/ui/form-error/form-error.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { LogoComponent } from '../../components/logo/logo.component';


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
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  protected setPasswordForm!: FormGroup;
  protected isLoading: boolean = false;
  protected userEmail: string = 'Loading...';
  protected apiError: string | null = null;

  private otp: string | null = null;
  private email: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private notificationService: NotificationService,
  ) { }


   ngOnInit(): void {
    this.email = this.authService.getEmail()
    this.otp = this.authService.getOtp()

    if (!this.email || !this.otp) {
      this.router.navigate([APP_ROUTES.FORGOT_PASSWORD]);
      return
    }

    this.setPasswordForm = this.createForm();
    this.setPasswordForm.get('otp')?.setValue(this.otp)
    this.setPasswordForm.get('otp')?.markAllAsTouched()
  }

  protected goBack(): void {
    this.router.navigate([APP_ROUTES.FORGOT_PASSWORD]);
  }


  private createForm(): FormGroup {
    return this.fb.group({
      otp: ['', [Validators.required, Validators.maxLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: passwordMatchValidator('newPassword', 'confirmPassword')
    });
  }




  protected get controls() {
    return this.setPasswordForm.controls as { [key: string]: AbstractControl };
  }


  protected get passwordsMismatch(): boolean {
    return this.setPasswordForm.errors?.['passwordMismatch'] as boolean;
  }

  protected onSubmit(): void {
    this.apiError = null;
    if (this.setPasswordForm.invalid) {
      this.setPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;


    const { newPassword,otp } = this.setPasswordForm.value;


    this.authService.resetPassword(otp, this.email as string, newPassword)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: () => {
          this.notificationService.success(`Password reset successful. You can now login with your new password.`)
        }
      });
  }
}