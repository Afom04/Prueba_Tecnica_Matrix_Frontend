import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'requests',
    canActivate: [authGuard],
    loadChildren: () => import('./features/requests/requests.routes').then(m => m.requestsRoutes)
  },
  {
    path: 'resources',
    canActivate: [authGuard],
    loadChildren: () => import('./features/resources/resources.routes').then(m => m.resourcesRoutes)
  },
  {
    path: '',
    redirectTo: 'requests',
    pathMatch: 'full'
  }
];
