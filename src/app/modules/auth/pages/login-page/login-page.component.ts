import { Component, effect, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { DividerComponent } from '../../../../shared/ui/divider/divider.component';
import { CheckboxComponent } from '../../../../shared/ui/checkbox/checkbox.component';
import { SecureTextComponent } from '../../../../shared/ui/secure-text/secure-text.component';
import { FormErrorComponent } from '../../../../shared/ui/form-error/form-error.component';
import { SocialLoginComponent } from '../../../../shared/ui/social-login-button/social-login-button.component';

// Import reusable UI components

interface LoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  remember: FormControl<boolean | null>;
}

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputComponent,
    ButtonComponent,
    DividerComponent,
    SecureTextComponent,
    SocialLoginComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  public form: FormGroup<LoginForm>;
  public isPasswordHidden = signal(true);
  public isSubmitted = signal(false);

  constructor(private readonly fb: FormBuilder) {
    this.form = this.createForm();

    effect(() => {
      const submitted = this.isSubmitted();
      const hidden = this.isPasswordHidden();
    });
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

  public hasFieldError(fieldName: keyof LoginForm): boolean {
    const field = this.form.get(fieldName);
    return !!(field?.invalid && (field.touched || this.isSubmitted()));
  }

  public getFieldErrorMessage(fieldName: keyof LoginForm): string {
    const field = this.form.get(fieldName);
    if (!field?.errors) return '';

    if (field.errors['required'])
      return `${this.capitalize(fieldName)} is required`;
    if (field.errors['email']) return 'Please enter a valid email address';
    if (field.errors['minlength'])
      return `${this.capitalize(fieldName)} must be at least ${
        field.errors['minlength']?.requiredLength
      } characters`;

    return '';
  }

  public togglePasswordVisibility(): void {
    this.isPasswordHidden.update((value) => !value);
  }

  public handleSubmit(): void {
    this.isSubmitted.set(true);
    this.form.markAllAsTouched();

    if (this.form.valid) {
      // handle valid form submission
    }
  }

  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
