import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { loadResources, deleteResource, clearResourceError } from '../../store/resource.actions';
import { selectAllResources, selectResourcePage, selectResourceTotalElements, selectResourceLoading, selectResourceError } from '../../store/resource.selectors';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InfiniteScrollDirective } from '../../../../shared/directives/infinite-scroll.directive';
import { ErrorTranslatePipe } from '../../../../shared/pipes/error-translate.pipe';
import { ConfirmService } from '../../../../shared/services/confirm.service';
import { combineLatest, map, take } from 'rxjs';

@Component({
  selector: 'app-resource-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslateModule, InfiniteScrollDirective, ErrorTranslatePipe],
  template: `
    <div class="list-container">
      <div class="header">
        <h2>{{ 'RESOURCES.TITLE' | translate }}</h2>
        <button class="btn-primary" routerLink="new">{{ 'RESOURCES.ADD_NEW' | translate }}</button>
      </div>

      <div *ngIf="error$ | async as error" class="error-alert">
        <span>{{ error | errorTranslate }}</span>
        <button class="btn-icon btn-delete" (click)="clearError()" style="margin: 0; padding: 0.2rem 0.5rem;">✕</button>
      </div>

      <div class="filters-bar">
        <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="filter-form">
          <input type="text" formControlName="name" [placeholder]="'RESOURCES.SEARCH_PLACEHOLDER' | translate" />
          <div class="filter-actions">
            <button type="submit" class="btn-filter">{{ 'COMMON.SEARCH' | translate }}</button>
            <button type="button" class="btn-clear" (click)="onClear()">{{ 'COMMON.CLEAR' | translate }}</button>
          </div>
        </form>
      </div>

      <div class="table-responsive">
        <div *ngIf="loading$ | async" class="loading-overlay">
          <div class="spinner"></div>
          <span>{{ 'RESOURCES.LOADING' | translate }}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>{{ 'COMMON.ID' | translate }}</th>
              <th>{{ 'COMMON.NAME' | translate }}</th>
              <th>{{ 'COMMON.DESCRIPTION' | translate }}</th>
              <th>{{ 'COMMON.ACTIONS' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let res of resources$ | async">
              <td>{{ res.id }}</td>
              <td>{{ res.name }}</td>
              <td>{{ res.description }}</td>
              <td>
                <button class="btn-icon btn-edit" [routerLink]="['edit', res.id]">{{ 'COMMON.EDIT' | translate }}</button>
                <button class="btn-icon btn-delete" (click)="onDelete(res.id)">{{ 'COMMON.DELETE' | translate }}</button>
              </td>
            </tr>
            <tr *ngIf="(resources$ | async)?.length === 0">
              <td colspan="4" class="empty">{{ 'RESOURCES.EMPTY' | translate }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div 
        *ngIf="hasMore$ | async" 
        appInfiniteScroll 
        (scrolled)="onScroll()" 
        class="scroll-sentinel"
      >
        <div *ngIf="loading$ | async" class="spinner-small"></div>
      </div>
    </div>
  `,
  styleUrls: [] 
})
export class ResourceListComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);
  private confirmService = inject(ConfirmService);

  resources$ = this.store.select(selectAllResources);
  loading$ = this.store.select(selectResourceLoading);
  error$ = this.store.select(selectResourceError);
  page$ = this.store.select(selectResourcePage);
  totalElements$ = this.store.select(selectResourceTotalElements);

  hasMore$ = combineLatest([this.resources$, this.totalElements$]).pipe(
    map(([resources, total]) => resources.length < total)
  );

  searchForm = this.fb.group({
    name: ['']
  });

  ngOnInit(): void {
    this.store.dispatch(loadResources({}));
  }

  onSearch(): void {
    this.store.dispatch(loadResources({ 
      page: 0,
      name: this.searchForm.value.name || undefined 
    }));
  }

  onClear(): void {
    this.searchForm.reset();
    this.onSearch();
  }

  onScroll(): void {
    combineLatest([this.hasMore$, this.page$, this.loading$])
      .pipe(take(1))
      .subscribe(([hasMore, page, loading]) => {
        if (hasMore && !loading) {
          this.store.dispatch(loadResources({
            page: page + 1,
            name: this.searchForm.value.name || undefined
          }));
        }
      });
  }

  onDelete(id: number): void {
    this.confirmService.confirm(this.translate.instant('COMMON.CONFIRM_DELETE'))
      .then(confirmed => {
        if (confirmed) {
          this.store.dispatch(deleteResource({ id }));
        }
      });
  }

  clearError(): void {
    this.store.dispatch(clearResourceError());
  }
}
