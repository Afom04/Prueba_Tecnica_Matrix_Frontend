import { RequestModel } from '../models/request.model';

export interface RequestState {
  requests: RequestModel[];
  totalElements: number;
  page: number;
  size: number;
  selectedRequest: RequestModel | null;
  loading: boolean;
  error: string | null;
}

export const initialRequestState: RequestState = {
  requests: [],
  totalElements: 0,
  page: 0,
  size: 10,
  selectedRequest: null,
  loading: false,
  error: null,
};
