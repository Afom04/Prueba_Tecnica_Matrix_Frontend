import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { RequestService } from '../services/request.service';
import * as RequestActions from './request.actions';

@Injectable()
export class RequestEffects {
  private actions$ = inject(Actions);
  private requestService = inject(RequestService);

  loadRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestActions.loadRequests),
      exhaustMap(action =>
        this.requestService.getAll(action).pipe(
          map(response => RequestActions.loadRequestsSuccess({ response })),
          catchError((error: Error) => of(RequestActions.loadRequestsFailure({ error: error.message })))
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
          catchError((error: Error) => of(RequestActions.createRequestFailure({ error: error.message })))
        )
      )
    )
  );

  updateRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestActions.updateRequest),
      exhaustMap(action =>
        this.requestService.update(action.id, action.request).pipe(
          map(request => RequestActions.updateRequestSuccess({ request })),
          catchError((error: Error) => of(RequestActions.updateRequestFailure({ error: error.message })))
        )
      )
    )
  );

  deleteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestActions.deleteRequest),
      exhaustMap(({ id }) =>
        this.requestService.delete(id).pipe(
          map(() => RequestActions.deleteRequestSuccess({ id })),
          catchError((error: Error) => of(RequestActions.deleteRequestFailure({ error: error.message })))
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
          catchError((error: Error) => of(RequestActions.findByIdFailure({ error: error.message })))
        )
      )
    )
  );
}
