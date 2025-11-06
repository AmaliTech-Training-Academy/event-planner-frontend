import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './modules/admin/auth.routes';
import { ATTENDEE_ROUTES } from './modules/attendee/attendee.routes';
import { ADMIN_ROUTES } from './modules/admin/admin.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  {
    path: 'auth',
    children: AUTH_ROUTES,
  },
  {
    path: 'app',
    loadComponent: () =>
      import('./layouts/atendee-layout/atendee-layout.component').then(
        (m) => m.AtendeeLayoutComponent
      ),
    children: ATTENDEE_ROUTES,
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    children: ADMIN_ROUTES,
  },
  // {
  //   path: '**',
  //   loadComponent: () =>
  //     import('./shared/pages/not-found-page/not-found-page.component').then(
  //       (m) => m.NotFoundPageComponent
  //     ),
  // },
];
