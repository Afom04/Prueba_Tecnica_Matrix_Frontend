import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-resource-form',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div style="padding: 2rem;">
      <h2>{{ 'RESOURCES.ADD_NEW' | translate }}</h2>
      <p>Form goes here. Implement similarly to request-form.component.</p>
      <button routerLink="/resources">{{ 'COMMON.CANCEL' | translate }}</button>
    </div>
  `
})
export class ResourceFormComponent {}
