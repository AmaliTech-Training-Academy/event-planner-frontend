import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  form: FormGroup;
  isPasswordHidden = true;
  isSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      remember: [false],
    });
  }

  // Optional convenience getter
  get controls() {
    return this.form.controls;
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.touched || this.isSubmitted));
  }

  getFieldErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;

    if (errors['required']) {
      return `${this.capitalize(fieldName)} is required`;
    }

    if (errors['email']) {
      return 'Please enter a valid email address';
    }

    if (errors['minlength']) {
      return `${this.capitalize(fieldName)} must be at least ${
        errors['minlength'].requiredLength
      } characters`;
    }

    return '';
  }

  togglePasswordVisibility(): void {
    this.isPasswordHidden = !this.isPasswordHidden;
  }

  handleSubmit(): void {
    this.isSubmitted = true;
    Object.keys(this.form.controls).forEach((key) =>
      this.form.get(key)?.markAsTouched()
    );

    if (this.form.valid) {
      console.log('✅ Login data:', this.form.value);
      // TODO: integrate AuthService here
    } else {
      console.warn('⚠️ Form is invalid');
    }
  }

  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
