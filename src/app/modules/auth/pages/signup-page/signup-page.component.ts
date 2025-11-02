import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from "../../../../shared/ui/button/button.component";
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { passwordMatchValidator } from '../../../../shared/validators/password-match.validator';
import { LogoComponent } from "../../components/logo/logo.component";
import { FORM_TYPE } from '../../constants/signup.constants';
import { NotificationService } from '../../../../core/services/notification.service';


@Component({
  selector: 'app-signup-page',
  imports: [CommonModule, ReactiveFormsModule, LogoComponent, RouterModule, ButtonComponent,InputComponent],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.scss'
})
export class SignupPageComponent implements OnInit , OnDestroy {

  protected signupForm: FormGroup;
  protected showPassword: boolean = false;
  protected showConfirmPassword: boolean = false;
  protected loading: boolean = false;
  private subscription: Subscription = new Subscription();


  constructor(private readonly fb: FormBuilder, private readonly authService: AuthService, private readonly notificationService: NotificationService) {
    this.signupForm = this.fb.group({
      [FORM_TYPE.FULL_NAME]: ['', [Validators.required, Validators.minLength(3)]],
      [FORM_TYPE.EMAIL]: ['', [Validators.required, Validators.email]],
      [FORM_TYPE.PASSWORD]: ['', [Validators.required, Validators.minLength(8)]],
      [FORM_TYPE.CONFIRM_PASSWORD]: ['', [Validators.required]],
    }, { validators: passwordMatchValidator(FORM_TYPE.PASSWORD, FORM_TYPE.CONFIRM_PASSWORD), });
  }

  ngOnInit(): void {
    this.subscription.add(
    this.authService.loading$.subscribe(isLoading => {
      this.loading = isLoading;
    }));
  }

  protected toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  protected toggleShowConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  protected onSubmit(): void {
   
    if (this.signupForm.valid) {
      this.loading = true;
      const { fullName, email, password, confirmPassword } = this.signupForm.value;
      this.authService.register(fullName, email, password, confirmPassword).subscribe({
        next: () => {
          this.notificationService.success('Registration successful! Login to continue.');
        }
      })
    } else {
      this.signupForm?.markAllAsTouched();
    }
  }

  protected getErrorMessage(controlName: string): string | null {

    switch (controlName) {
      case FORM_TYPE.FULL_NAME:
        if (this.hasError(controlName, 'required')) {
          return 'Full name is required.';
        }
        if (this.hasError(controlName, 'minlength')) {
          return 'Full name must be at least 3 characters.';
        }
        break;

      case FORM_TYPE.EMAIL:
        if (this.hasError(controlName, 'required')) {
          return 'Email is required.';
        }
        if (this.hasError(controlName, 'email')) {
          return 'Please enter a valid email address.';
        }
        break;

      case FORM_TYPE.PASSWORD:
        if (this.hasError(controlName, 'required')) {
          return 'Password is required.';
        }
        if (this.hasError(controlName, 'minlength')) {
          return 'Password must be at least 8 characters.';
        }
        break;

      case FORM_TYPE.CONFIRM_PASSWORD:
        if (this.hasError(controlName, 'required')) {
          return 'Please confirm your password.';
        }
        if (this.signupForm.errors?.['passwordMismatch'] && this.signupForm.touched) {
          return 'Passwords do not match.';
        }
        break;

      default:
        return null;
    }

    return null;
  }


  private hasError(controlName: string, error: string): boolean {
    const control = this.signupForm?.get(controlName);
    return !!(control && control?.touched && control?.hasError(error));
  }


  protected get getLoginRoute() {
    return APP_ROUTES.LOGIN
  }

  protected get formTypes() {
    return FORM_TYPE;
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
