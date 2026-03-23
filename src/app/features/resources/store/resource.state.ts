import { ResourceModel } from '../models/resource.model';

export interface ResourceState {
  resources: ResourceModel[];
  totalElements: number;
  page: number;
  size: number;
  loading: boolean;
  error: string | null;
}

export const initialResourceState: ResourceState = {
  resources: [],
  totalElements: 0,
  page: 0,
  size: 10,
  loading: false,
  error: null,
};
