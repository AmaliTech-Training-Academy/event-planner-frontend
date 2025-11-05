import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LogoComponent } from '../../components/logo/logo.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { FormErrorComponent } from '../../../../shared/ui/form-error/form-error.component';
import { OtpInputComponent } from '../../../../shared/ui/otp-input/otp-input.component';
import { AuthService } from '../../../../core/services/auth.service';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { NotificationService } from '../../../../core/services/notification.service';

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

  protected isLoading: boolean = false;

  private currentOtpValue: string = '';
  private isOtpReady: boolean = false;
  private email: string = '';

  constructor(
    private readonly authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  public ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { email?: string };

    if (state && state.email) {
      this.email = state.email;
    } else {
      this.router.navigate([APP_ROUTES.LOGIN]);
    }
  }

  protected onOtpChange(otpValue: string): void {
    this.currentOtpValue = otpValue;
    this.isOtpReady = otpValue.length === 6;
  }

  protected isOtpComplete(): boolean {
    return this.isOtpReady;
  }

  protected verifyAccount(): void {

    this.isLoading = true;

    this.authService.verifyEmail(this.currentOtpValue, this.email)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.notificationService.success(response.description);
        }

      });
  }

  protected resendOtp(): void {

    if (this.isLoading) return;

    this.isLoading = true;

    this.authService.resendOtp(this.email)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {

          this.currentOtpValue = '';
          this.isOtpReady = false;
        }

      });
  }
}
