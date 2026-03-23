import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { loadRequests, deleteRequest } from '../../store/request.actions';
import { selectAllRequests, selectRequestsLoading } from '../../store/request.selectors';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RequestStatus } from '../../models/request.model';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);
  
  requests$ = this.store.select(selectAllRequests);
  loading$ = this.store.select(selectRequestsLoading);

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
      name: filters.name || undefined,
      email: filters.email || undefined,
      status: (filters.status as RequestStatus) || undefined
    }));
  }

  onDelete(id: number): void {
    if (confirm(this.translate.instant('COMMON.CONFIRM_DELETE'))) {
      this.store.dispatch(deleteRequest({ id }));
    }
  }
}
