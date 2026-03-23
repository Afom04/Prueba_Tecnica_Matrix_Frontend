import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { loadResources, deleteResource } from '../../store/resource.actions';
import { selectAllResources } from '../../store/resource.selectors';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-resource-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="list-container">
      <div class="header">
        <h2>{{ 'RESOURCES.TITLE' | translate }}</h2>
        <button class="btn-primary" routerLink="new">{{ 'RESOURCES.ADD_NEW' | translate }}</button>
      </div>

      <div class="filters-bar">
        <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="filter-form">
          <input type="text" formControlName="name" [placeholder]="'RESOURCES.SEARCH_PLACEHOLDER' | translate" />
          <button type="submit" class="btn-filter">{{ 'COMMON.SEARCH' | translate }}</button>
        </form>
      </div>

      <div class="table-responsive">
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
    </div>
  `,
  styleUrls: [] 
})
export class ResourceListComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);

  resources$ = this.store.select(selectAllResources);
  searchForm = this.fb.group({
    name: ['']
  });

  ngOnInit(): void {
    this.store.dispatch(loadResources({}));
  }

  onSearch(): void {
    this.store.dispatch(loadResources({ name: this.searchForm.value.name || undefined }));
  }

  onDelete(id: number): void {
    if (confirm(this.translate.instant('COMMON.CONFIRM_DELETE'))) {
      this.store.dispatch(deleteResource({ id }));
    }
  }
}
