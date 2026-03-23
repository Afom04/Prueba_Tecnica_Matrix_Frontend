import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService);
  private apiUrl = `${environment.apiUrl}/auth`;

  login(credentials: { email?: string; password?: string; username?: string }): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
