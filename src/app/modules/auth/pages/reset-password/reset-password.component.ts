import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule, 
  AbstractControl, 
  ValidationErrors, 
  ValidatorFn, 
  FormsModule 
} from '@angular/forms';
import { LogoComponent } from '../../components/logo/logo.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component'; 
import { FormErrorComponent } from '../../../../shared/ui/form-error/form-error.component';
import { InputComponent } from '../../../../shared/ui/input/input.component'; 


export function passwordMatchValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get(passwordField)?.value;
    const confirmPassword = formGroup.get(confirmPasswordField)?.value;

    if (!password || !confirmPassword) {
      return null; 
    }

    if (password !== confirmPassword) {
        formGroup.get(confirmPasswordField)?.setErrors({ 'passwordMismatch': true });
        return { passwordMismatch: true };
    } else {
      
        if (formGroup.get(confirmPasswordField)?.hasError('passwordMismatch')) {
            formGroup.get(confirmPasswordField)?.setErrors(null);
        }
    }
    return null;
  };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule,
    LogoComponent,
    ButtonComponent, 
    FormErrorComponent,
    InputComponent,
    FormsModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  
  protected setPasswordForm!: FormGroup;
  protected isLoading: boolean = false;
 
  protected userEmail: string = 'user@eventhub.com'; 
 
  protected showTermsChecked = signal(false); 

  
  constructor(private fb: FormBuilder) {}

  
  public ngOnInit(): void {
    this.setPasswordForm = this.fb.group({
      fullName: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { 
      validators: passwordMatchValidator('newPassword', 'confirmPassword') 
    });
  }

 
  protected get controls() {
    return this.setPasswordForm.controls as { [key: string]: AbstractControl };
  }
  
  protected get passwordsMismatch(): boolean {
    return this.setPasswordForm.errors?.['passwordMismatch'] as boolean;
  }

  
  protected onSubmit(): void {
   if (this.setPasswordForm.invalid) {
      this.setPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      alert('Password set successfully! You can now log in.');
    }, 2000);
  }
}