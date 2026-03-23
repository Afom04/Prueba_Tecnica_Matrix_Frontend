import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../store/auth/auth.selectors';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const authService = inject(AuthService);

  // We check the store. However, on hard refresh, the store might be empty 
  // until rehydrated. The simplest approach for now is checking token in localStorage too,
  // or just relying on the selector if state is persisted. 
  // Since we don't have hydration yet, we combine store and local storage check.
  const token = authService.getToken();
  if (token) {
    return true; // We could optionally dispatch a loginSuccess here to rehydrate
  }

  return router.createUrlTree(['/login']);
};
