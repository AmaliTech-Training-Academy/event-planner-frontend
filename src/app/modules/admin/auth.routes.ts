import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('../auth/pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('../auth/pages/signup-page/signup-page.component').then(
        (m) => m.SignupPageComponent
      ),
  },
  {
    path: 'verify-email',
    loadComponent: () =>
      import(
        '../auth/pages/verify-email-page/verify-email-page.component'
      ).then((m) => m.VerifyEmailPageComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import(
        '../auth/pages/forgot-password-page/forgot-password-page.component'
      ).then((m) => m.ForgotPasswordComponent),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('../auth/pages/admin-login-page/admin-login-page.component').then(
        (m) => m.AdminLoginPageComponent
      ),
  },
];
