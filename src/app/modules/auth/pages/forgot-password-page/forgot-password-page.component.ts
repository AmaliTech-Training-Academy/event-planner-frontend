import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.scss'
})
export class ForgotPasswordComponent {
  protected forgotPasswordForm: FormGroup;
  protected loading = false;
  protected message: string | null = null;
  protected isError = false;

  constructor(private readonly fb: FormBuilder, private readonly authService: AuthService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  protected get f() {
    return this.forgotPasswordForm.controls;
  }

  protected onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.loading = true;
    const { email } = this.forgotPasswordForm.value;
    this.authService.forgotPassword(email)
      .pipe(finalize(() => this.loading = false)).subscribe({
        error:(err) =>{
          this.isError= true;
        },
      })
  }
}