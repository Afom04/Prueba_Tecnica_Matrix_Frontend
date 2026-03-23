import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { requestReducer } from './store/request.reducer';
import { RequestEffects } from './store/request.effects';

export const requestsRoutes: Routes = [
  {
    path: '',
    providers: [
      provideState('requests', requestReducer),
      provideEffects([RequestEffects])
    ],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/request-list/request-list.component').then(m => m.RequestListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./pages/request-form/request-form.component').then(m => m.RequestFormComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./pages/request-form/request-form.component').then(m => m.RequestFormComponent)
      }
    ]
  }
];
