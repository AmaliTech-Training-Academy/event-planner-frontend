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
    canActivate: [UnAuthenticatedUsersOnlyGuard],
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('../auth/pages/signup-page/signup-page.component').then(
        (m) => m.SignupPageComponent
      ),
    canActivate: [UnAuthenticatedUsersOnlyGuard], 
  },
  {
    path: 'verify-email',
    loadComponent: () =>
      import(
        '../auth/pages/verify-email-page/verify-email-page.component'
      ).then((m) => m.VerifyEmailPageComponent),
    canActivate: [UnAuthenticatedUsersOnlyGuard], 
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import(
        '../auth/pages/forgot-password-page/forgot-password-page.component'
      ).then((m) => m.ForgotPasswordComponent),
    canActivate: [UnAuthenticatedUsersOnlyGuard], 
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('../auth/pages/admin-login-page/admin-login-page.component').then(
        (m) => m.AdminLoginPageComponent
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('../auth/pages/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
    canActivate: [UnAuthenticatedUsersOnlyGuard], 
  },
  {
    path: 'invitation/accept',
    loadComponent: () =>
      import(
        '../auth/pages/accept-invite-page/accept-invite-page.component'
      ).then((m) => m.AcceptInvitePageComponent),
    
  },
  {
    path: 'event-invitations/accept',
    loadComponent: () =>
      import(
        '../attendee/pages/user-accept-invite/user-accept-invite.component'
      ).then((m) => m.UserAcceptInviteComponent),
   
  },

];
