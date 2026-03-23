import { createReducer, on } from '@ngrx/store';
import { initialResourceState } from './resource.state';
import * as ResourceActions from './resource.actions';

export const resourceReducer = createReducer(
  initialResourceState,
  on(ResourceActions.loadResources, (state) => ({ ...state, loading: true, error: null })),
  on(ResourceActions.loadResourcesSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    resources: response.content,
    totalElements: response.totalElements,
    page: response.number,
    size: response.size
  })),
  on(ResourceActions.loadResourcesFailure, (state, { error }) => ({ ...state, loading: false, error })),
  
  on(ResourceActions.createResource, (state) => ({ ...state, loading: true, error: null })),
  on(ResourceActions.createResourceSuccess, (state, { resource }) => ({
    ...state,
    loading: false,
    resources: [...state.resources, resource]
  })),
  on(ResourceActions.createResourceFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(ResourceActions.updateResource, (state) => ({ ...state, loading: true, error: null })),
  on(ResourceActions.updateResourceSuccess, (state, { resource }) => ({
    ...state,
    loading: false,
    resources: state.resources.map(r => r.id === resource.id ? resource : r)
  })),
  on(ResourceActions.updateResourceFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(ResourceActions.deleteResource, (state) => ({ ...state, loading: true })),
  on(ResourceActions.deleteResourceSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    resources: state.resources.filter(r => r.id !== id)
  })),
  on(ResourceActions.deleteResourceFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
