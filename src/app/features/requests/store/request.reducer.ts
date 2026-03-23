import { createReducer, on } from '@ngrx/store';
import { initialRequestState } from './request.state';
import * as RequestActions from './request.actions';

export const requestReducer = createReducer(
  initialRequestState,
  
  on(RequestActions.loadRequests, (state) => ({ ...state, loading: true, error: null })),
  on(RequestActions.loadRequestsSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    requests: response.content,
    totalElements: response.totalElements,
    page: response.number,
    size: response.size
  })),
  on(RequestActions.loadRequestsFailure, (state, { error }) => ({ ...state, loading: false, error })),
  
  on(RequestActions.createRequest, (state) => ({ ...state, loading: true, error: null })),
  on(RequestActions.createRequestSuccess, (state, { request }) => ({
    ...state,
    loading: false,
    requests: [...state.requests, request]
  })),
  on(RequestActions.createRequestFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(RequestActions.updateRequest, (state) => ({ ...state, loading: true, error: null })),
  on(RequestActions.updateRequestSuccess, (state, { request }) => ({
    ...state,
    loading: false,
    requests: state.requests.map(r => r.id === request.id ? request : r)
  })),
  on(RequestActions.updateRequestFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(RequestActions.deleteRequest, (state) => ({ ...state, loading: true })),
  on(RequestActions.deleteRequestSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    requests: state.requests.filter(r => r.id !== id)
  })),
  on(RequestActions.deleteRequestFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(RequestActions.findById, (state) => ({ ...state, loading: true })),
  on(RequestActions.findByIdSuccess, (state, { request }) => ({
    ...state,
    loading: false,
    selectedRequest: request
  })),
  on(RequestActions.findByIdFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
