import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorTranslatePipe } from '../../../../shared/pipes/error-translate.pipe';
import { createResource, updateResource, findResourceById } from '../../store/resource.actions';
import { selectSelectedResource, selectResourceLoading, selectResourceError } from '../../store/resource.selectors';
import { filter, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-resource-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule, ErrorTranslatePipe],
  template: `
    <div class="form-container">
      <h2>{{ (resourceId ? 'RESOURCES.EDIT_TITLE' : 'RESOURCES.NEW_TITLE') | translate }}</h2>
      
      <div *ngIf="error$ | async as error" class="error-alert">
        {{ error | errorTranslate }}
      </div>

      <form [formGroup]="resourceForm" (ngSubmit)="onSubmit()" *ngIf="!((error$ | async) && resourceId && !(loading$ | async))">
        <div class="form-group">
          <label>{{ 'COMMON.NAME' | translate }}</label>
          <input type="text" formControlName="name" [placeholder]="'COMMON.NAME' | translate" />
          <div *ngIf="resourceForm.get('name')?.touched && resourceForm.get('name')?.errors?.['required']" class="error">
            {{ 'COMMON.REQUIRED' | translate }}
          </div>
        </div>

        <div class="form-group">
          <label>{{ 'COMMON.DESCRIPTION' | translate }}</label>
          <textarea formControlName="description" [placeholder]="'COMMON.DESCRIPTION' | translate" rows="4"></textarea>
        </div>

        <div class="actions">
          <button type="button" class="btn-cancel" routerLink="/resources">{{ 'COMMON.CANCEL' | translate }}</button>
          <button type="submit" class="btn-submit" [disabled]="resourceForm.invalid || (loading$ | async)">
            <span *ngIf="loading$ | async" class="spinner-button"></span>
            {{ (loading$ | async) ? ('COMMON.LOADING' | translate) : ('COMMON.SAVE' | translate) }}
          </button>
        </div>
      </form>

      <div *ngIf="(error$ | async) && resourceId && !(loading$ | async)" class="error-placeholder">
        <p>{{ 'ERRORS.LOAD_FAILED' | translate | errorTranslate }}</p>
        <button class="btn-cancel" routerLink="/resources">{{ 'COMMON.CANCEL' | translate }}</button>
      </div>
    </div>
  `,
  styles: [`
    .form-container {
      padding: 2rem;
      max-width: 600px;
      margin: 3rem auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);

      @media (max-width: 768px) {
        margin: 1rem;
        padding: 1.5rem;
      }

      h2 {
        margin-top: 0;
        margin-bottom: 2rem;
        color: #333;
        border-bottom: 2px solid #f0f0f0;
        padding-bottom: 1rem;
        
        @media (max-width: 768px) {
          font-size: 1.5rem;
        }
      }

      .form-group {
        margin-bottom: 1.5rem;

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #555;
        }

        input, select, textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          box-sizing: border-box;
          font-family: inherit;
          
          &:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
          }
        }
      }

      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid #eee;

        button {
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-cancel {
          background: #f8f9fa;
          border: 1px solid #ddd;
          color: #666;
          &:hover { background: #e2e6ea; }
        }

        .btn-submit {
          background: #28a745; 
          border: none;
          color: white;
          &:hover { background: #218838; }
          &:disabled { background: #ccc; cursor: not-allowed; }
        }

        .spinner-button {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
      }
    }
  }
  `]
})
export class ResourceFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  resourceId: number | null = null;
  loading$ = this.store.select(selectResourceLoading);
  error$ = this.store.select(selectResourceError);

  resourceForm = this.fb.group({
    name: ['', Validators.required],
    description: ['']
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.resourceId = +idParam;
      this.store.dispatch(findResourceById({ id: this.resourceId }));

      this.store.select(selectSelectedResource).pipe(
        filter(res => !!res && res.id === this.resourceId),
        take(1)
      ).subscribe(res => {
        this.resourceForm.patchValue({
          name: res!.name,
          description: res!.description
        });
      });
    }
  }

  onSubmit(): void {
    if (this.resourceForm.valid) {
      const val = this.resourceForm.value;
      const payload = {
        name: val.name!,
        description: val.description || ''
      };

      if (this.resourceId) {
        this.store.dispatch(updateResource({ id: this.resourceId, resource: payload }));
      } else {
        this.store.dispatch(createResource({ resource: payload }));
      }
    }
  }
}
