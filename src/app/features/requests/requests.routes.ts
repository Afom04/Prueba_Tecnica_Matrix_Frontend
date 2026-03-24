import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { requestReducer } from './store/request.reducer';
import { RequestEffects } from './store/request.effects';
import { resourceReducer } from '../resources/store/resource.reducer';
import { ResourceEffects } from '../resources/store/resource.effects';

export const requestsRoutes: Routes = [
  {
    path: '',
    providers: [
      provideState('requests', requestReducer),
      provideState('resources', resourceReducer),
      provideEffects([RequestEffects, ResourceEffects])
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
