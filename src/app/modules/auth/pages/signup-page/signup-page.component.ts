import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { passwordMatchValidator } from '../../../../shared/validators/password-match.validator';
import { LogoComponent } from "../../components/logo/logo.component";

@Component({
  selector: 'app-signup-page',
  imports: [CommonModule, ReactiveFormsModule, LogoComponent, RouterModule],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.scss'
})
export class SignupPageComponent {

  protected signupForm: FormGroup;
  protected showPassword: boolean = false;
  protected showConfirmPassword: boolean = false;
  protected loading: boolean = false;

  constructor(private readonly fb: FormBuilder, private readonly authService: AuthService) {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: passwordMatchValidator('password', 'confirmPassword'), });
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
      this.authService.register(fullName, email, password, confirmPassword)
        .pipe(finalize(() => this.loading = false)).subscribe()
    } else {
      this.signupForm?.markAllAsTouched();
    }
  }

  protected hasError(controlName: string, error: string): boolean {
    const control = this.signupForm?.get(controlName);
    return !!(control && control?.touched && control?.hasError(error));
  }


}
