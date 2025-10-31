// admin-login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { SecureTextComponent } from '../../../../shared/ui/secure-text/secure-text.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { RouterLink } from '@angular/router';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';


@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    SecureTextComponent,
    ButtonComponent,
    RouterLink,
  ],
  templateUrl: './admin-login-page.component.html',
  styleUrls: ['./admin-login-page.component.scss'],
})
export class AdminLoginPageComponent {
  public loginForm: FormGroup;
  protected readonly APP_ROUTES = APP_ROUTES;

  private readonly emailPattern =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(private readonly fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  public onSubmit(): void {
    if (this.loginForm.valid) {
    }
  }

  public getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (control?.hasError('required')) {
      return `${field} is required`;
    }
    if (control?.hasError('pattern')) {
      return 'Please enter a valid email';
    }
    return '';
  }
}
