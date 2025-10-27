// verify-email-page.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router'; 
import { Subscription } from 'rxjs'; 
import { finalize } from 'rxjs/operators'; 

import { LogoComponent } from '../../components/logo/logo.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component'; 
import { FormErrorComponent } from '../../../../shared/ui/form-error/form-error.component';
import { OtpInputComponent } from '../../../../shared/ui/otp-input/otp-input.component'; 
import { AuthService } from '../../../../core/services/auth.service'; 

@Component({
  selector: 'app-verify-email-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    LogoComponent,
    ButtonComponent, 
    FormErrorComponent,
    OtpInputComponent 
  ],
  templateUrl: './verify-email-page.component.html',
  styleUrls: ['./verify-email-page.component.scss']
})
export class VerifyEmailPageComponent implements OnInit, OnDestroy {

  protected currentOtpValue: string = ''; 
  protected isOtpReady: boolean = false; 
  protected isLoading: boolean = false; 
  protected apiMessage: string | null = null;
  protected isError: boolean = false;

  private email: string | null = null;
  private routeSub: Subscription | null = null;

  
  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute
  ) { }

  public ngOnInit(): void {
   
    this.routeSub = this.route.queryParamMap.subscribe(params => {
      this.email = params.get('email');
      if (!this.email) {
        this.apiMessage = 'Invalid page URL. No email provided.';
        this.isError = true;
      }
    });
  }

  public ngOnDestroy(): void {
    
    this.routeSub?.unsubscribe();
  }

  protected onOtpChange(otpValue: string): void {
    this.currentOtpValue = otpValue;
    this.isOtpReady = otpValue.length === 6;
  
    if (this.apiMessage) {
      this.apiMessage = null;
      this.isError = false;
    }
  }

  protected isOtpComplete(): boolean {
    return this.isOtpReady;
  }

  protected verifyAccount(): void {
    if (!this.isOtpComplete()) {
      this.apiMessage = 'Please enter the complete 6-digit OTP.';
      this.isError = true;
      return;
    }

    if (!this.email) {
      this.apiMessage = 'Could not find email from URL. Please go back and try again.';
      this.isError = true;
      return;
    }

    this.isLoading = true;
    this.apiMessage = null; 
   
    
    this.authService.verifyEmail(this.currentOtpValue, this.email)
      .pipe(
        finalize(() => this.isLoading = false) 
      )
      .subscribe({
        next: () => {
          this.isError = false;
          this.apiMessage = 'Account verified successfully! Redirecting...';
       
        },
        error: (err) => {
          this.isError = true;
          this.apiMessage = err.error?.message || 'Verification failed. The code may be invalid or expired.';
        }
      });
  }

  protected resendOtp(): void {
    if(this.isLoading) return;

    if (!this.email) {
      this.apiMessage = 'Cannot resend OTP: No email found.';
      this.isError = true;
      return;
    }

    this.isLoading = true;
    this.apiMessage = null; 
    
   
    this.authService.resendOtp(this.email)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: () => {
          this.isError = false;
          this.apiMessage = 'A new OTP has been sent to your email.';
          this.currentOtpValue = ''; 
          this.isOtpReady = false;
        },
        error: (err) => {
          this.isError = true;
          this.apiMessage = err.error?.message || 'Failed to resend OTP. Please try again later.';
        }
      });
  }
}