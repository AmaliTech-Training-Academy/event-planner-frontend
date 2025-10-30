import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '../../components/logo/logo.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component'; 
import { FormErrorComponent } from '../../../../shared/ui/form-error/form-error.component';
import { OtpInputComponent } from '../../../../shared/ui/otp-input/otp-input.component'; 

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
export class VerifyEmailPageComponent implements OnInit {

  
  protected currentOtpValue: string = ''; 
  protected isOtpReady: boolean = false; 
  protected isLoading: boolean = false; 
  protected apiMessage: string | null = null;
  protected isError: boolean = false;

  constructor() { }

  
  public ngOnInit(): void { }

  
 
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

    this.isLoading = true;
    this.apiMessage = null; 
   
    
    
    setTimeout(() => {
      this.isLoading = false;
      this.isError = false;
      this.apiMessage = 'Account verified successfully! Redirecting...';
      

    }, 2000);
  }

  
  
  protected resendOtp(): void {
   
    if(this.isLoading) return;

    this.isLoading = true;
    this.apiMessage = null; 
    
    
    setTimeout(() => {
      this.isLoading = false;
      this.isError = false;
      this.apiMessage = 'A new OTP has been sent to your email.';
      
      
      this.currentOtpValue = ''; 
      this.isOtpReady = false;
      
      
    }, 2000);
  }
}