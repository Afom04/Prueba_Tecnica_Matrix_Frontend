import { createAction, props } from '@ngrx/store';
import { ResourceModel } from '../models/resource.model';
import { PaginatedResponse } from '../../../core/models/pagination.model';

export const loadResources = createAction(
  '[Resource] Load Resources',
  props<{ name?: string; page?: number; size?: number }>()
);
export const loadResourcesSuccess = createAction('[Resource] Load Resources Success', props<{ response: PaginatedResponse<ResourceModel> }>());
export const loadResourcesFailure = createAction('[Resource] Load Resources Failure', props<{ error: string }>());

export const createResource = createAction('[Resource] Create Resource', props<{ resource: Partial<ResourceModel> }>());
export const createResourceSuccess = createAction('[Resource] Create Resource Success', props<{ resource: ResourceModel }>());
export const createResourceFailure = createAction('[Resource] Create Resource Failure', props<{ error: string }>());

export const updateResource = createAction('[Resource] Update Resource', props<{ id: number; resource: Partial<ResourceModel> }>());
export const updateResourceSuccess = createAction('[Resource] Update Resource Success', props<{ resource: ResourceModel }>());
export const updateResourceFailure = createAction('[Resource] Update Resource Failure', props<{ error: string }>());

export const deleteResource = createAction('[Resource] Delete Resource', props<{ id: number }>());
export const deleteResourceSuccess = createAction('[Resource] Delete Resource Success', props<{ id: number }>());
export const deleteResourceFailure = createAction('[Resource] Delete Resource Failure', props<{ error: string }>());

export const findResourceById = createAction('[Resource] Find By Id', props<{ id: number }>());
export const findResourceByIdSuccess = createAction('[Resource] Find By Id Success', props<{ resource: ResourceModel }>());
export const findResourceByIdFailure = createAction('[Resource] Find By Id Failure', props<{ error: string }>());

export const clearResourceError = createAction('[Resource] Clear Error');
