import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { FormErrorComponent } from '../../../../shared/ui/form-error/form-error.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { LogoComponent } from '../../components/logo/logo.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LogoComponent, FormErrorComponent, ButtonComponent, InputComponent],
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  protected forgotPasswordForm!: FormGroup;
  protected isLoading: boolean = false;
  protected apiMessage: string | null = null;
  protected isError: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly router: Router 
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.subscriptions = this.authService.loading$.subscribe(loading => {
      this.isLoading = loading;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected get f() {
    return this.forgotPasswordForm.controls;
  }

  protected get email(): AbstractControl | null {
    return this.forgotPasswordForm.get('email');
  }

  protected get APP_ROUTES() {
    return APP_ROUTES;
  }

  protected onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }
    const { email } = this.forgotPasswordForm.value;

    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
        this.notificationService.success(response.description);

        
        this.router.navigate([APP_ROUTES.RESET_PASSWORD], { queryParams: { email } });
      },
      complete: () => {
        this.forgotPasswordForm.reset();
      }
    })

  }
}
