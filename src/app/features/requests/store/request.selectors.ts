import { createSelector, createFeatureSelector } from '@ngrx/store';
import { RequestState } from './request.state';

export const selectRequestState = createFeatureSelector<RequestState>('requests');

export const selectAllRequests = createSelector(selectRequestState, (state) => state.requests);
export const selectRequestsLoading = createSelector(selectRequestState, (state) => state.loading);
export const selectRequestsError = createSelector(selectRequestState, (state) => state.error);
export const selectRequestPage = createSelector(selectRequestState, (state) => state.page);
export const selectRequestTotalElements = createSelector(selectRequestState, (state) => state.totalElements);
export const selectRequestSize = createSelector(selectRequestState, (state) => state.size);
