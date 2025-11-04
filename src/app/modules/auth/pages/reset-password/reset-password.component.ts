import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router, RouterModule } from '@angular/router'; 
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
import { Subscription } from 'rxjs'; 
import { finalize } from 'rxjs/operators'; 
import { LogoComponent } from '../../components/logo/logo.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component'; 
import { FormErrorComponent } from '../../../../shared/ui/form-error/form-error.component';
import { InputComponent } from '../../../../shared/ui/input/input.component'; 
import { AuthService } from '../../../../core/services/auth.service'; 
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants'; 


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
export class ResetPasswordComponent implements OnInit, OnDestroy { 
  
  protected setPasswordForm!: FormGroup;
  protected isLoading: boolean = false;
  protected userEmail: string = 'Loading...'; 
  protected apiError: string | null = null; 
  
  private routeSub: Subscription | null = null;
  private token: string | null = null; 
  private email: string | null = null; 

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  
  public ngOnInit(): void {
    
    this.routeSub = this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token'); 
      this.email = params.get('email');
      
      this.userEmail = this.email || 'your-email@provider.com'; 
      
      if (!this.token || !this.email) {
        this.apiError = 'Invalid or missing reset token or email in the URL.';
      }
    });

    
    this.setPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { 
      validators: passwordMatchValidator('newPassword', 'confirmPassword') 
    });
  }

  
  public ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  
  protected get controls() {
    return this.setPasswordForm.controls as { [key: string]: AbstractControl };
  }
  
  
  protected get passwordsMismatch(): boolean {
    return this.setPasswordForm.errors?.['passwordMismatch'] as boolean;
  }

  
  protected onSubmit(): void {
    this.apiError = null; 
    if (this.setPasswordForm.invalid) {
      this.setPasswordForm.markAllAsTouched();
      return;
    }

    if (!this.token || !this.email) {
      this.apiError = 'Cannot submit: Token or email missing from URL.';
      return;
    }

    this.isLoading = true;
    
    
    const { newPassword } = this.setPasswordForm.value;

    
    this.authService.resetPassword(this.token, this.email, newPassword)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: () => {
          
          alert('Password has been reset! You can now log in.'); 
        },
        error: (err: any) => {
          this.apiError = err.error?.message || 'Failed to reset password. The token may be invalid or expired.';
        }
      });
  }
}