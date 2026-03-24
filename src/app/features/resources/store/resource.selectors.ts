import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ResourceState } from './resource.state';

export const selectResourceState = createFeatureSelector<ResourceState>('resources');

export const selectAllResources = createSelector(selectResourceState, (state) => state.resources);
export const selectResourcePage = createSelector(selectResourceState, (state) => state.page);
export const selectResourceTotalElements = createSelector(selectResourceState, (state) => state.totalElements);
export const selectResourceSize = createSelector(selectResourceState, (state) => state.size);
export const selectResourceLoading = createSelector(selectResourceState, (state) => state.loading);
export const selectSelectedResource = createSelector(selectResourceState, (state) => state.selectedResource);
export const selectResourceError = createSelector(selectResourceState, (state) => state.error);
