import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private translate = inject(TranslateService);
  
  constructor() {
    const savedLang = localStorage.getItem('language') || 'es';
    this.translate.setDefaultLang('es');
    this.translate.use(savedLang);
  }

  setLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang || 'es';
  }
}
