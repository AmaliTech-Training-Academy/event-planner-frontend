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
  {
    path: 'events/:id',
    loadComponent: () =>
      import(
        '../admin/pages/event-management-page/components/event-details-page/event-details.component-page'
      ).then((m) => m.EventDetailsPageComponent),
  },

  {
    path: 'saved-invites',
    loadComponent: () =>
      import('./pages/saved-invite/saved-invite-page.component').then(
        (m) => m.SavedInviteComponent
      ),
    // canActivate: [AdminGuard], // Consider adding this for consistency
  },
  {
    path: 'audit-logs',
    loadComponent: () =>
      import('./pages/audit-logs-page/audit-logs-page.component').then(
        (m) => m.AuditLogsComponent
      ),
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./pages/transactions-page/transactions-page.component').then(
        (m) => m.TransactionsPageComponent
      ),
    // canActivate: [AdminGuard],
  }
];
