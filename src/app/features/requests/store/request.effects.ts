import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, tap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { RequestService } from '../services/request.service';
import * as RequestActions from './request.actions';
import { mapHttpErrorToKey } from '../../../core/utils/error-handler.util';

@Injectable()
export class RequestEffects {
  private actions$ = inject(Actions);
  private requestService = inject(RequestService);
  private router = inject(Router);

  loadRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestActions.loadRequests),
      switchMap(action =>
        this.requestService.getAll(action).pipe(
          map(response => RequestActions.loadRequestsSuccess({ response })),
          catchError((error) => of(RequestActions.loadRequestsFailure({ error: mapHttpErrorToKey(error, 'ERRORS.LOAD_FAILED') })))
        )
      )
    )
  );

  createRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestActions.createRequest),
      exhaustMap(action =>
        this.requestService.create(action.request).pipe(
          map(request => RequestActions.createRequestSuccess({ request })),
          catchError((error) => of(RequestActions.createRequestFailure({ error: mapHttpErrorToKey(error, 'ERRORS.CREATE_FAILED') })))
        )
      )
    )
  );

  createRequestSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestActions.createRequestSuccess),
      tap(() => this.router.navigate(['/requests']))
    ),
    { dispatch: false }
  );

  updateRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestActions.updateRequest),
      exhaustMap(action =>
        this.requestService.update(action.id, action.request).pipe(
          map(request => RequestActions.updateRequestSuccess({ request })),
          catchError((error) => of(RequestActions.updateRequestFailure({ error: mapHttpErrorToKey(error, 'ERRORS.UPDATE_FAILED') })))
        )
      )
    )
  );

  updateRequestSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestActions.updateRequestSuccess),
      tap(() => this.router.navigate(['/requests']))
    ),
    { dispatch: false }
  );

  deleteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestActions.deleteRequest),
      exhaustMap(({ id }) =>
        this.requestService.delete(id).pipe(
          map(() => RequestActions.deleteRequestSuccess({ id })),
          catchError((error) => of(RequestActions.deleteRequestFailure({ error: mapHttpErrorToKey(error, 'ERRORS.DELETE_FAILED') })))
        )
      )
    )
  );

  findById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestActions.findById),
      exhaustMap(({ id }) =>
        this.requestService.getById(id).pipe(
          map(request => RequestActions.findByIdSuccess({ request })),
          catchError((error) => of(RequestActions.findByIdFailure({ error: mapHttpErrorToKey(error, 'ERRORS.LOAD_FAILED') })))
        )
      )
    )
  );
}
