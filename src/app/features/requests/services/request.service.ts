import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestModel, RequestStatus } from '../models/request.model';
import { PaginatedResponse } from '../../../core/models/pagination.model';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private api = inject(ApiService);
  private apiUrl = `${environment.apiUrl}/requests`;

  getAll(filters?: { status?: RequestStatus; name?: string; email?: string; page?: number; size?: number }): Observable<PaginatedResponse<RequestModel>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.name) params = params.set('name', filters.name);
      if (filters.email) params = params.set('email', filters.email);
      if (filters.page !== undefined) params = params.set('page', filters.page.toString());
      if (filters.size !== undefined) params = params.set('size', filters.size.toString());
    }
    return this.api.get<PaginatedResponse<RequestModel>>(this.apiUrl, params);
  }

  getById(id: number): Observable<RequestModel> {
    return this.api.get<RequestModel>(`${this.apiUrl}/${id}`);
  }

  create(request: Partial<RequestModel>): Observable<RequestModel> {
    return this.api.post<RequestModel>(this.apiUrl, request);
  }

  update(id: number, request: Partial<RequestModel>): Observable<RequestModel> {
    return this.api.patch<RequestModel>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.apiUrl}/${id}`);
  }
}
