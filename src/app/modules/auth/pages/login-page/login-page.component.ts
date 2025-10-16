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
  public form: FormGroup<LoginForm>;

  public isPasswordHidden = signal(true);
  public isSubmitted = signal(false);

  constructor(private readonly fb: FormBuilder) {
    this.form = this.createForm();

    // Example effect if you want reactive logic
    effect(() => {
      // can react to changes in signals here
      const submitted = this.isSubmitted();
      const hidden = this.isPasswordHidden();
      // console.log('Form submitted:', submitted, 'Password hidden:', hidden);
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
    const field = this.form?.get(fieldName);
    return !!(field?.invalid && (field?.touched || this.isSubmitted()));
  }

  public getFieldErrorMessage(fieldName: keyof LoginForm): string {
    const field = this.form?.get(fieldName);
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
    this.form?.markAllAsTouched();

    if (this.form?.valid) {
      // handle valid form submission
    }
  }

  private capitalize(text: string): string {
    return text?.charAt(0).toUpperCase() + text?.slice(1);
  }
}
