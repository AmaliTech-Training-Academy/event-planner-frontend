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
        loadComponent: () => import('./auth/pages/login-page/login-page.component')
          .then(m => m.LoginPageComponent),
      },
      {
        path: 'signup',
        loadComponent: () => import('./auth/pages/signup-page/signup-page.component')
          .then(m => m.SignupPageComponent),
      },
      {
        path: 'verify-email',
        loadComponent: () => import('./auth/pages/verify-email-page/verify-email-page.component')
          .then(m => m.VerifyEmailPageComponent),
      },
      {
        path: 'admin',
        loadComponent: () => import('./auth/pages/admin-login-page/admin-login-page.component')
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
        loadComponent: () => import('./attendee/pages/landing-page/landing-page.component')
          .then(m => m.LandingPageComponent),
      },
      {
        path: 'about',
        loadComponent: () => import('./attendee/pages/about-page/about-page.component')
          .then(m => m.AboutPageComponent),
      },
      {
        path: 'explore',
        loadComponent: () => import('./attendee/pages/explore-page/explore-page.component')
          .then(m => m.ExplorePageComponent),
      },
      {
        path: 'create-event',
        loadComponent: () => import('./attendee/pages/create-event-page/create-event-page.component')
          .then(m => m.CreateEventPageComponent),
      },
      {
        path: 'event/:id',
        loadComponent: () => import('./attendee/pages/event-page/event-page.component')
          .then(m => m.EventPageComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./attendee/pages/profile-page/profile-page.component')
          .then(m => m.ProfilePageComponent),
      },
      {
        path: 'my-events',
        loadComponent: () => import('./attendee/pages/my-events-page/my-events-page.component')
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
        loadComponent: () => import('./admin/pages/dashboard-page/dashboard-page.component')
          .then(m => m.DashboardPageComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./admin/pages/user-management-page/user-management-page.component')
          .then(m => m.UserManagementPageComponent),
      },
    ]
  }
];
