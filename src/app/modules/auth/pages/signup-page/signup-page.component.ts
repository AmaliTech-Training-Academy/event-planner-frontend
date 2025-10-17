import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LogoComponent } from "../../components/logo/logo.component";
import { RouterModule } from '@angular/router';
import { passwordMatchValidator } from '../../../../shared/validators/password-match.validator';

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

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, {  validators: passwordMatchValidator('password', 'confirmPassword'), });
  }

  protected toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  protected toggleShowConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  protected onSubmit(): void {
    if (this.signupForm.valid) {
      console.log('Signup data:', this.signupForm.value);
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  protected hasError(controlName: string, error: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!(control && control.touched && control.hasError(error));
  }


}
