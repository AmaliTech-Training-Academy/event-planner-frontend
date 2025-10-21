import { Component, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '../../components/logo/logo.component'; 

@Component({
  selector: 'app-verify-email-page', 
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    LogoComponent 
  ],
  templateUrl: './verify-email-page.component.html',
  styleUrls: ['./verify-email-page.component.scss']
})
export class VerifyEmailPageComponent {
  
  otp: string[] = ['', '', '', '', '', '']; 
  isLoading: boolean = false; 
  apiMessage: string | null = null; 
  isError: boolean = false; 
  
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  constructor() { }
  
  onOtpInput(event: Event, index: number): void { }
  onKeyDown(event: KeyboardEvent, index: number): void {  }
  isOtpComplete(): boolean { return this.otp.every(digit => digit !== ''); }
  verifyAccount(): void {  }
  resendOtp(): void {  }
}