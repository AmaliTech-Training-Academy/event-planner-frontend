import { Routes } from '@angular/router';
import { UnAuthenticatedUsersOnlyGuard } from '../../core/guards/unauthenticated-users-only.guard';

export const AUTH_ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('../auth/pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
    canActivate: [UnAuthenticatedUsersOnlyGuard], // Add here
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('../auth/pages/signup-page/signup-page.component').then(
        (m) => m.SignupPageComponent
      ),
    canActivate: [UnAuthenticatedUsersOnlyGuard], // Add here
  },
  {
    path: 'verify-email',
    loadComponent: () =>
      import(
        '../auth/pages/verify-email-page/verify-email-page.component'
      ).then((m) => m.VerifyEmailPageComponent),
    canActivate: [UnAuthenticatedUsersOnlyGuard], // Add here
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import(
        '../auth/pages/forgot-password-page/forgot-password-page.component'
      ).then((m) => m.ForgotPasswordComponent),
    canActivate: [UnAuthenticatedUsersOnlyGuard], // Add here
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('../auth/pages/admin-login-page/admin-login-page.component').then(
        (m) => m.AdminLoginPageComponent
      ),
    canActivate: [UnAuthenticatedUsersOnlyGuard], // Add here
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('../auth/pages/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
    canActivate: [UnAuthenticatedUsersOnlyGuard], // Add here
  },
  {
    path: 'invitation/accept',
    loadComponent: () =>
      import(
        '../auth/pages/accept-invite-page/accept-invite-page.component'
      ).then((m) => m.AcceptInvitePageComponent),
    // NO GUARD - Allow anyone to access this route
  },
];
