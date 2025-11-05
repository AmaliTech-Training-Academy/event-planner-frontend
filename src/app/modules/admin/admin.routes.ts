import { Routes } from '@angular/router';
import { AdminGuard } from '../../core/guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../admin/pages/dashboard-page/dashboard-page.component').then(
        (m) => m.DashboardPageComponent
      ),
    // canActivate: [AdminGuard],
  },
  {
    path: 'users',
    loadComponent: () =>
      import(
        '../admin/pages/user-management-page/user-management-page.component'
      ).then((m) => m.UserManagementPageComponent),
    // canActivate: [AdminGuard],
  },
  {
    path: 'events',
    loadComponent: () =>
      import(
        '../admin/pages/event-management-page/event-management-page.component'
      ).then((m) => m.EventManagementPageComponent),
    // canActivate: [AdminGuard],
  },
];
