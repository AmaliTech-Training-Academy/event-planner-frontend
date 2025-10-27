import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        '../admin/pages/dashboard-page/dashboard-page.component'
      ).then((m) => m.DashboardPageComponent),
  },
  {
    path: 'users',
    loadComponent: () =>
      import(
        '../admin/pages/user-management-page/user-management-page.component'
      ).then((m) => m.UserManagementPageComponent),
  },
];
