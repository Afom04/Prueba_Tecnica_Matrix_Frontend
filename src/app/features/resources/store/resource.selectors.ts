import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ResourceState } from './resource.state';

export const selectResourceState = createFeatureSelector<ResourceState>('resources');
export const selectAllResources = createSelector(selectResourceState, (state) => state.resources);
