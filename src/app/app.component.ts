import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from './core/store/auth/auth.selectors';
import { logout } from './core/store/auth/auth.actions';
import { LanguageService } from './core/services/language.service';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, FormsModule, ConfirmDialogComponent],
  template: `
    <nav class="main-nav" *ngIf="isLoggedIn$ | async">
      <div class="nav-brand">ABC Solicitudes</div>
      <div class="nav-links">
        <a routerLink="/requests" routerLinkActive="active">{{ 'NAV.REQUESTS' | translate }}</a>
        <a routerLink="/resources" routerLinkActive="active">{{ 'NAV.RESOURCES' | translate }}</a>
        
        <div class="lang-selector">
          <button (click)="onLanguageChange('es')" [class.active]="currentLang === 'es'" title="Español">🇪🇸</button>
          <button (click)="onLanguageChange('en')" [class.active]="currentLang === 'en'" title="English">🇺🇸</button>
        </div>

        <button (click)="onLogout()" class="btn-logout">{{ 'COMMON.LOGOUT' | translate }}</button>
      </div>
    </nav>
    <main [style.padding-top]="(isLoggedIn$ | async) ? '2rem' : '0'"
          [style.background]="(isLoggedIn$ | async) ? '#f8f9fa' : 'transparent'">
      <router-outlet></router-outlet>
    </main>
    <app-confirm-dialog />
  `,
  styles: [`
    .main-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 2rem;
      background: #2c3e50;
      color: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      position: sticky;
      top: 0;
      z-index: 1000;
      
      @media (max-width: 768px) {
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
      }
      
      .nav-brand { 
        font-size: 1.4rem; 
        font-weight: 800;
        background: linear-gradient(135deg, #3498db, #2ecc71);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .nav-links {
        display: flex;
        gap: 2rem;
        align-items: center;

        @media (max-width: 768px) {
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          
          a { width: 100%; text-align: center; padding: 0.5rem 0; }
          .btn-logout { width: 100%; }
        }
        
        a {
          color: #ecf0f1;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          position: relative;
          
          &:after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 0;
            height: 2px;
            background: #3498db;
            transition: width 0.3s ease;
          }

          &.active { 
            color: #3498db; 
            &:after { width: 100%; }
          }
          &:hover { color: #3498db; }
        }

        .lang-selector {
          display: flex;
          gap: 0.5rem;
          background: rgba(255,255,255,0.1);
          padding: 0.25rem;
          border-radius: 8px;

          button {
            background: transparent;
            border: none;
            font-size: 1.25rem;
            cursor: pointer;
            padding: 0.25rem 0.5rem;
            border-radius: 6px;
            transition: all 0.2s;
            filter: grayscale(0.8) opacity(0.6);

            &:hover {
              filter: grayscale(0) opacity(1);
              background: rgba(255,255,255,0.1);
            }

            &.active {
              filter: grayscale(0) opacity(1);
              background: rgba(255,255,255,0.2);
              box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
            }
          }
        }
      }
    }
    .btn-logout {
      background: linear-gradient(135deg, #e74c3c, #c0392b);
      color: white;
      border: none;
      padding: 0.5rem 1.25rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 700;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(231, 76, 60, 0.2);

      &:hover { 
        transform: translateY(-1px);
        box-shadow: 0 6px 12px rgba(231, 76, 60, 0.3);
      }

      &:active { transform: translateY(0); }
    }
    main { min-height: 100vh; }
  `]
})
export class AppComponent {
  private store = inject(Store);
  private langService = inject(LanguageService);
  
  isLoggedIn$ = this.store.select(selectIsAuthenticated);

  get currentLang() {
    return this.langService.getCurrentLanguage();
  }

  onLanguageChange(lang: string): void {
    this.langService.setLanguage(lang);
  }

  onLogout(): void {
    this.store.dispatch(logout());
  }
}
