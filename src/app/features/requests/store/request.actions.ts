import { createAction, props } from '@ngrx/store';
import { RequestModel, RequestStatus } from '../models/request.model';
import { PaginatedResponse } from '../../../core/models/pagination.model';

export const loadRequests = createAction(
  '[Request] Load Requests',
  props<{ status?: RequestStatus; name?: string; email?: string; page?: number; size?: number }>()
);
export const loadRequestsSuccess = createAction('[Request] Load Requests Success', props<{ response: PaginatedResponse<RequestModel> }>());
export const loadRequestsFailure = createAction('[Request] Load Requests Failure', props<{ error: string }>());

export const createRequest = createAction('[Request] Create Request', props<{ request: Partial<RequestModel> }>());
export const createRequestSuccess = createAction('[Request] Create Request Success', props<{ request: RequestModel }>());
export const createRequestFailure = createAction('[Request] Create Request Failure', props<{ error: string }>());

export const updateRequest = createAction('[Request] Update Request', props<{ id: number; request: Partial<RequestModel> }>());
export const updateRequestSuccess = createAction('[Request] Update Request Success', props<{ request: RequestModel }>());
export const updateRequestFailure = createAction('[Request] Update Request Failure', props<{ error: string }>());

export const deleteRequest = createAction('[Request] Delete Request', props<{ id: number }>());
export const deleteRequestSuccess = createAction('[Request] Delete Request Success', props<{ id: number }>());
export const deleteRequestFailure = createAction('[Request] Delete Request Failure', props<{ error: string }>());

export const findById = createAction('[Request] Find By Id', props<{ id: number }>());
export const findByIdSuccess = createAction('[Request] Find By Id Success', props<{ request: RequestModel }>());
export const findByIdFailure = createAction('[Request] Find By Id Failure', props<{ error: string }>());
