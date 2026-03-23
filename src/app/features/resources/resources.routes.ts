import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { resourceReducer } from './store/resource.reducer';
import { ResourceEffects } from './store/resource.effects';

export const resourcesRoutes: Routes = [
  {
    path: '',
    providers: [
      provideState('resources', resourceReducer),
      provideEffects([ResourceEffects])
    ],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/resource-list/resource-list.component').then(m => m.ResourceListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./pages/resource-form/resource-form.component').then(m => m.ResourceFormComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./pages/resource-form/resource-form.component').then(m => m.ResourceFormComponent)
      }
    ]
  }
];
