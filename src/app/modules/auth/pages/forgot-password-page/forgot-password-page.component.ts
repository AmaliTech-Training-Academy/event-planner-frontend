import { Component, OnInit } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule, 
  AbstractControl 
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '../../components/logo/logo.component';
import { FormErrorComponent } from '../../../../shared/ui/form-error/form-error.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component'; 
import { AuthService } from '../../../../core/services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
 selector: 'app-forgot-password',
 standalone: true,
 imports: [CommonModule, ReactiveFormsModule, RouterModule, LogoComponent,FormErrorComponent,ButtonComponent,InputComponent],
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  protected forgotPasswordForm!: FormGroup;
  protected isLoading: boolean = false;
  protected apiMessage: string | null = null;
  protected isError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
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

    // this.isLoading = true;

    // const email = this.email?.value;

    // this.authService.forgotPassword(email)
    //   .pipe(finalize(() => (this.isLoading = false)))
    //   .subscribe({
    //     next: () => {
    //       this.isError = false;
          
    //     },
    //     error: (error: any) => { 
    //       this.isError = true;
          
    //     }
    
  }}