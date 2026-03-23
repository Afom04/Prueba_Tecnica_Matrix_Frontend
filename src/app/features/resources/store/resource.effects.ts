import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { ResourceService } from '../services/resource.service';
import * as ResourceActions from './resource.actions';

@Injectable()
export class ResourceEffects {
  private actions$ = inject(Actions);
  private resourceService = inject(ResourceService);

  loadResources$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResourceActions.loadResources),
      exhaustMap(action =>
        this.resourceService.getAll(action).pipe(
          map(response => ResourceActions.loadResourcesSuccess({ response })),
          catchError((error: Error) => of(ResourceActions.loadResourcesFailure({ error: error.message })))
        )
      )
    )
  );

  createResource$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResourceActions.createResource),
      exhaustMap(action =>
        this.resourceService.create(action.resource).pipe(
          map(resource => ResourceActions.createResourceSuccess({ resource })),
          catchError((error: Error) => of(ResourceActions.createResourceFailure({ error: error.message })))
        )
      )
    )
  );

  updateResource$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResourceActions.updateResource),
      exhaustMap(action =>
        this.resourceService.update(action.id, action.resource).pipe(
          map(resource => ResourceActions.updateResourceSuccess({ resource })),
          catchError((error: Error) => of(ResourceActions.updateResourceFailure({ error: error.message })))
        )
      )
    )
  );

  deleteResource$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResourceActions.deleteResource),
      exhaustMap(({ id }) =>
        this.resourceService.delete(id).pipe(
          map(() => ResourceActions.deleteResourceSuccess({ id })),
          catchError((error: Error) => of(ResourceActions.deleteResourceFailure({ error: error.message })))
        )
      )
    )
  );

  findById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResourceActions.findResourceById),
      exhaustMap(({ id }) =>
        this.resourceService.getById(id).pipe(
          map(resource => ResourceActions.findResourceByIdSuccess({ resource })),
          catchError((error: Error) => of(ResourceActions.findResourceByIdFailure({ error: error.message })))
        )
      )
    )
  );
}
