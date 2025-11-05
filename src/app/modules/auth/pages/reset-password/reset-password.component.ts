import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { NotificationService } from '../../../../core/services/notification.service';


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
    FormsModule,
    LogoComponent,
    ButtonComponent,
    FormErrorComponent,
    InputComponent,
    OtpInputComponent,
  
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  protected setPasswordForm!: FormGroup;
  protected isLoading: boolean = false;
  protected userEmail: string = 'Loading...';
  protected apiError: string | null = null;

  private token: string | null = null;
  private email: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private notificationService: NotificationService,
  ) { }


   ngOnInit(): void {
    this.email = this.authService.getEmail()
    if (!this.email) {
      this.router.navigate([APP_ROUTES.FORGOT_PASSWORD]);
      return
    }

    this.setPasswordForm = this.createForm();
  }


  private createForm(): FormGroup {
    return this.fb.group({
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
    return !!this.setPasswordForm.errors?.['passwordMismatch'];
  }

  protected get APP_ROUTES() {
    return APP_ROUTES;
  }


  protected onSubmit(): void {
    this.apiError = null;
    if (this.setPasswordForm.invalid) {
      this.setPasswordForm.markAllAsTouched();
      return;
    }

  const { otp, newPassword } = this.setPasswordForm.value;

  if (!otp || !newPassword || !this.email) {
    return;
  }

    this.isLoading = true;


    const { newPassword } = this.setPasswordForm.value;


    this.authService.resetPassword(this.token, this.email, newPassword)
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