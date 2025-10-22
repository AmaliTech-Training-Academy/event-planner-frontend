import { Component } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule, 
  AbstractControl 
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogoComponent as logoComponent } from '../../components/logo/logo.component';
import { FormErrorComponent } from '../../../../shared/ui/form-error/form-error.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component'; 

@Component({
 selector: 'app-forgot-password',
 standalone: true,
 imports: [CommonModule, ReactiveFormsModule, RouterModule, logoComponent,FormErrorComponent,ButtonComponent,InputComponent],
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss']
})
export class ForgotPasswordComponent {

  protected forgotPasswordForm: FormGroup;
  protected isLoading: boolean = false; 
  protected apiMessage: string | null = null;
  protected isError: boolean = false;
  
  
  constructor(private fb: FormBuilder) { 
    this.forgotPasswordForm = this.fb.group({
      email: ['user@gmail.com', [Validators.required, Validators.email]]
    });
  }

    protected get email(): AbstractControl | null {
    return this.forgotPasswordForm.get('email');
  }

  
  protected sendCode(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true; 
   
    const email = this.email?.value; 
    
   
    setTimeout(() => {
      this.isLoading = false;
      this.isError = false; 
      this.apiMessage = `An OTP has been sent to ${email}`;
    }, 2000);
  }
}