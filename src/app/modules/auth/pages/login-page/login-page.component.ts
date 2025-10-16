import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface LoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  remember: FormControl<boolean | null>;
}

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  form: FormGroup<LoginForm>;
  isPasswordHidden = true;
  isSubmitted = false;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.createForm();
  }

  private createForm(): FormGroup<LoginForm> {
    return this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      remember: this.fb.control(false),
    });
  }

  get controls() {
    return this.form.controls;
  }

  hasFieldError(fieldName: keyof LoginForm): boolean {
    return !!(
      this.form.get(fieldName)?.invalid &&
      (this.form.get(fieldName)?.touched || this.isSubmitted)
    );
  }

  getFieldErrorMessage(fieldName: keyof LoginForm): string {
    const field = this.form.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required'])
      return `${this.capitalize(fieldName)} is required`;
    if (field.errors['email']) return 'Please enter a valid email address';
    if (field.errors['minlength'])
      return `${this.capitalize(fieldName)} must be at least ${
        field.errors['minlength'].requiredLength
      } characters`;

    return '';
  }

  togglePasswordVisibility(): void {
    this.isPasswordHidden = !this.isPasswordHidden;
  }

  handleSubmit(): void {
    this.isSubmitted = true;
    this.form.markAllAsTouched();

    if (this.form.valid) {
    } else {
    }
  }

  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
