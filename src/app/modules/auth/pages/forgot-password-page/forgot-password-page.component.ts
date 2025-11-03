import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule, 
  AbstractControl 
} from '@angular/forms';
import { CommonModule,  } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '../../components/logo/logo.component';
import { FormErrorComponent } from '../../../../shared/ui/form-error/form-error.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component'; 
import { AuthService } from '../../../../core/services/auth.service';
import { finalize, takeUntil } from 'rxjs/operators'; 
import { Subject } from 'rxjs';
 import { APP_ROUTES } from '../../../../core/constants/routes.constants';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule, 
    LogoComponent,
    FormErrorComponent,
    ButtonComponent,
    InputComponent,
    
  ],
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy { 

  forgotPasswordForm!: FormGroup;
  isLoading: boolean = false;
  apiMessage: string | null = null;
  isError: boolean = false;
protected readonly routes = APP_ROUTES;
  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder, 
    private readonly authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

 
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get email(): AbstractControl | null {
    return this.forgotPasswordForm.get('email');
  }

  sendCode(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    this.apiMessage = null;
    this.isError = false;

    const email = this.forgotPasswordForm.value.email;

    (this.authService.sendResetCode(email) as any)
      .pipe(
        
        takeUntil(this.unsubscribe$), 
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response: any) => {
          this.isError = false;
          this.apiMessage = response.message || 'OTP sent successfully. Please check your email.'; 
        },
        error: (err: any) => {
          this.isError = true;
          this.apiMessage = err.error?.message || 'An unknown error occurred. Please try again.';
        }
      });
  }

}