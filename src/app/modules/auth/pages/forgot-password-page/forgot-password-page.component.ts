import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogoComponent as logoComponent } from '../../components/logo/logo.component';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, logoComponent],
  templateUrl: './forgot-password-page.component.html', 
  styleUrls: ['./forgot-password-page.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading: boolean = false; 
  apiMessage: string | null = null;
  isError: boolean = false;
  
  constructor(private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
      email: ['user@gmail.com', [Validators.required, Validators.email]]
    });
  }

  get controls() {
    return this.forgotPasswordForm.controls;
  }

  sendCode(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true; 
    const email = this.controls['email'].value;
    
    setTimeout(() => {
      this.isLoading = false;
      this.isError = false;
      this.apiMessage = `An OTP has been sent to ${email}`;
    }, 2000);
  }
}