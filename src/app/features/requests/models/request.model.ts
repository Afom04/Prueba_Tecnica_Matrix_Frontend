export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface RequestModel {
  id: number;
  applicantName: string;
  applicantEmail: string;
  status: RequestStatus;
  resourceId: number;
  resourceName?: string;
  createdAt: string;
}
