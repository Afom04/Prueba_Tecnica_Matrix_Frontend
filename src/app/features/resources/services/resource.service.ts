import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResourceModel } from '../models/resource.model';
import { PaginatedResponse } from '../../../core/models/pagination.model';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class ResourceService {
  private api = inject(ApiService);
  private apiUrl = `${environment.apiUrl}/resources`;

  getAll(filters?: { name?: string; page?: number; size?: number }): Observable<PaginatedResponse<ResourceModel>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.name) params = params.set('name', filters.name);
      if (filters.page !== undefined) params = params.set('page', filters.page.toString());
      if (filters.size !== undefined) params = params.set('size', filters.size.toString());
    }
    return this.api.get<PaginatedResponse<ResourceModel>>(this.apiUrl, params);
  }

  getById(id: number): Observable<ResourceModel> {
    return this.api.get<ResourceModel>(`${this.apiUrl}/${id}`);
  }

  create(resource: Partial<ResourceModel>): Observable<ResourceModel> {
    return this.api.post<ResourceModel>(this.apiUrl, resource);
  }

  update(id: number, resource: Partial<ResourceModel>): Observable<ResourceModel> {
    return this.api.patch<ResourceModel>(`${this.apiUrl}/${id}`, resource);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.apiUrl}/${id}`);
  }
}
