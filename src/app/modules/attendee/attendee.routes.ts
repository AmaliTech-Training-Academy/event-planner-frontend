import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

export const ATTENDEE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../attendee/pages/landing-page/landing-page.component').then(
        (m) => m.LandingPageComponent
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('../attendee/pages/about-page/about-page.component').then(
        (m) => m.AboutPageComponent
      ),
  },
  {
    path: 'explore',
    loadComponent: () =>
      import('../attendee/pages/explore-page/explore-page.component').then(
        (m) => m.ExplorePageComponent
      ),
  },
  {
    path: 'create-event',
    loadComponent: () =>
      import(
        '../attendee/pages/create-event-page/create-event-page.component'
      ).then((m) => m.CreateEventPageComponent),
    // canActivate: [AuthGuard],
  },
  {
    path: 'create-event-success',
    loadComponent: () =>
      import(
        '../attendee/pages/create-event-success/create-event-success.component'
      ).then((m) => m.CreateEventSuccessComponent),
    // canActivate: [AuthGuard],
  },
  {
    path: 'event/:id',
    loadComponent: () =>
      import('../attendee/pages/event-page/event-page.component').then(
        (m) => m.EventPageComponent
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('../attendee/pages/profile-page/profile-page.component').then(
        (m) => m.ProfilePageComponent
      ),
    // canActivate: [AuthGuard],
  },
  {
    path: 'my-events',
    loadComponent: () =>
      import('../attendee/pages/my-events-page/my-events-page.component').then(
        (m) => m.MyEventsPageComponent
      ),
    // canActivate: [AuthGuard],
  },
];
