import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.scss'
})
export class SignupPageComponent {
  signupForm: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // password match validator
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      console.log('Signup data:', this.signupForm.value);
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  hasError(controlName: string, error: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!(control && control.touched && control.hasError(error));
  }


}
