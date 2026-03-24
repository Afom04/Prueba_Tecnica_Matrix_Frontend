import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { loadRequests, deleteRequest, clearRequestError } from '../../store/request.actions';
import { selectAllRequests, selectRequestsLoading, selectRequestsError, selectRequestPage, selectRequestTotalElements, selectRequestSize } from '../../store/request.selectors';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RequestStatus } from '../../models/request.model';
import { InfiniteScrollDirective } from '../../../../shared/directives/infinite-scroll.directive';
import { ErrorTranslatePipe } from '../../../../shared/pipes/error-translate.pipe';
import { ConfirmService } from '../../../../shared/services/confirm.service';
import { combineLatest, map, take } from 'rxjs';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslateModule, InfiniteScrollDirective, ErrorTranslatePipe],
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);
  private confirmService = inject(ConfirmService);
  
  requests$ = this.store.select(selectAllRequests);
  loading$ = this.store.select(selectRequestsLoading);
  error$ = this.store.select(selectRequestsError);
  page$ = this.store.select(selectRequestPage);
  totalElements$ = this.store.select(selectRequestTotalElements);
  size$ = this.store.select(selectRequestSize);

  hasMore$ = combineLatest([this.requests$, this.totalElements$]).pipe(
    map(([requests, total]) => requests.length < total)
  );

  filterForm = this.fb.group({
    name: [''],
    email: [''],
    status: ['' as RequestStatus | '']
  });

  ngOnInit(): void {
    this.store.dispatch(loadRequests({}));
  }

  onFilter(): void {
    const filters = this.filterForm.value;
    this.store.dispatch(loadRequests({
      page: 0,
      name: filters.name || undefined,
      email: filters.email || undefined,
      status: (filters.status as RequestStatus) || undefined
    }));
  }

  onScroll(): void {
    combineLatest([this.hasMore$, this.page$, this.loading$])
      .pipe(take(1))
      .subscribe(([hasMore, page, loading]) => {
        if (hasMore && !loading) {
          const filters = this.filterForm.value;
          this.store.dispatch(loadRequests({
            page: page + 1,
            name: filters.name || undefined,
            email: filters.email || undefined,
            status: (filters.status as RequestStatus) || undefined
          }));
        }
      });
  }

  onDelete(id: number): void {
    this.confirmService.confirm(this.translate.instant('COMMON.CONFIRM_DELETE'))
      .then(confirmed => {
        if (confirmed) {
          this.store.dispatch(deleteRequest({ id }));
        }
      });
  }

  clearError(): void {
    this.store.dispatch(clearRequestError());
  }
}
