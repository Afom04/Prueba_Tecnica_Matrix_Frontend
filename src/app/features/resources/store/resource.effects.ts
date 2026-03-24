import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, tap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ResourceService } from '../services/resource.service';
import * as ResourceActions from './resource.actions';
import { mapHttpErrorToKey } from '../../../core/utils/error-handler.util';

@Injectable()
export class ResourceEffects {
  private actions$ = inject(Actions);
  private resourceService = inject(ResourceService);
  private router = inject(Router);

  loadResources$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResourceActions.loadResources),
      switchMap(action =>
        this.resourceService.getAll(action).pipe(
          map(response => ResourceActions.loadResourcesSuccess({ response })),
          catchError((error) => of(ResourceActions.loadResourcesFailure({ error: mapHttpErrorToKey(error, 'ERRORS.LOAD_FAILED') })))
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
          catchError((error) => of(ResourceActions.createResourceFailure({ error: mapHttpErrorToKey(error, 'ERRORS.CREATE_FAILED') })))
        )
      )
    )
  );

  createResourceSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResourceActions.createResourceSuccess),
      tap(() => this.router.navigate(['/resources']))
    ),
    { dispatch: false }
  );

  updateResource$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResourceActions.updateResource),
      exhaustMap(action =>
        this.resourceService.update(action.id, action.resource).pipe(
          map(resource => ResourceActions.updateResourceSuccess({ resource })),
          catchError((error) => of(ResourceActions.updateResourceFailure({ error: mapHttpErrorToKey(error, 'ERRORS.UPDATE_FAILED') })))
        )
      )
    )
  );

  updateResourceSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResourceActions.updateResourceSuccess),
      tap(() => this.router.navigate(['/resources']))
    ),
    { dispatch: false }
  );

  deleteResource$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResourceActions.deleteResource),
      exhaustMap(({ id }) =>
        this.resourceService.delete(id).pipe(
          map(() => ResourceActions.deleteResourceSuccess({ id })),
          catchError((error) => of(ResourceActions.deleteResourceFailure({ error: mapHttpErrorToKey(error, 'ERRORS.DELETE_FAILED') })))
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
          catchError((error) => of(ResourceActions.findResourceByIdFailure({ error: mapHttpErrorToKey(error, 'ERRORS.LOAD_FAILED') })))
        )
      )
    )
  );
}
