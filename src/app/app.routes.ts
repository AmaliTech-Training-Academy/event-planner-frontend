import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./modules/auth/pages/login-page/login-page.component')
          .then(m => m.LoginPageComponent),
      },
      {
        path: 'signup',
        loadComponent: () => import('./modules/auth/pages/signup-page/signup-page.component')
          .then(m => m.SignupPageComponent),
      },
      {
        path: 'verify-email',
        loadComponent: () => import('./modules/auth/pages/verify-email-page/verify-email-page.component')
          .then(m => m.VerifyEmailPageComponent),
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./modules/auth/pages/forgot-password-page/forgot-password-page.component')
          .then(m => m.ForgotPasswordComponent),
      },
      {
        path: 'admin',
        loadComponent: () => import('./modules/auth/pages/admin-login-page/admin-login-page.component')
          .then(m => m.AdminLoginPageComponent),
      }
    ]
  },
  {
    path: 'app',
    loadComponent: ()=>import('./layouts/atendee-layout/atendee-layout.component').then(m => m.AtendeeLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./modules/attendee/pages/landing-page/landing-page.component')
          .then(m => m.LandingPageComponent),
      },
      {
        path: 'about',
        loadComponent: () => import('./modules/attendee/pages/about-page/about-page.component')
          .then(m => m.AboutPageComponent),
      },
      {
        path: 'explore',
        loadComponent: () => import('./modules/attendee/pages/explore-page/explore-page.component')
          .then(m => m.ExplorePageComponent),
      },
      {
        path: 'create-event',
        loadComponent: () => import('./modules/attendee/pages/create-event-page/create-event-page.component')
          .then(m => m.CreateEventPageComponent),
      },
      {
        path: 'event/:id',
        loadComponent: () => import('./modules/attendee/pages/event-page/event-page.component')
          .then(m => m.EventPageComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./modules/attendee/pages/profile-page/profile-page.component')
          .then(m => m.ProfilePageComponent),
      },
      {
        path: 'my-events',
        loadComponent: () => import('./modules/attendee/pages/my-events-page/my-events-page.component')
          .then(m => m.MyEventsPageComponent),
      },
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./modules/admin/pages/dashboard-page/dashboard-page.component')
          .then(m => m.DashboardPageComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./modules/admin/pages/user-management-page/user-management-page.component')
          .then(m => m.UserManagementPageComponent),
      },
    ]
  }
];
