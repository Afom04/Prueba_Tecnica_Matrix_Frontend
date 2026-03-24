import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorTranslatePipe } from '../../../../shared/pipes/error-translate.pipe';
import { createRequest, updateRequest, findById } from '../../store/request.actions';
import { loadResources } from '../../../resources/store/resource.actions';
import { selectRequestsLoading, selectRequestsError, selectRequestState } from '../../store/request.selectors';
import { selectAllResources, selectResourceLoading } from '../../../resources/store/resource.selectors';
import { filter, take, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RequestStatus } from '../../models/request.model';
import { Subject } from 'rxjs';
import { AutocompleteComponent } from '../../../../shared/components/autocomplete/autocomplete.component';

@Component({
  selector: 'app-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule, ErrorTranslatePipe, AutocompleteComponent],
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss']
})
export class RequestFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  requestId: number | null = null;
  resources$ = this.store.select(selectAllResources);
  resourcesLoading$ = this.store.select(selectResourceLoading);
  loading$ = this.store.select(selectRequestsLoading);
  error$ = this.store.select(selectRequestsError);

  initialResourceName: string = '';
  private searchSubject = new Subject<string>();

  requestForm = this.fb.group({
    applicantName: ['', Validators.required],
    applicantEmail: ['', [Validators.required, Validators.email]],
    resourceId: [null as number | null, Validators.required],
    status: ['PENDING' as RequestStatus]
  });

  get statusOptions(): RequestStatus[] {
    const currentStatus = (this.requestForm.get('status')?.value as RequestStatus) || 'PENDING';
    
    // Si es nuevo, solo PENDING (o dejarlo así)
    if (!this.requestId) return ['PENDING'];

    // Si ya está en un estado final (APPROVED/REJECTED), no puede volver a PENDING
    if (currentStatus === 'APPROVED' || currentStatus === 'REJECTED') {
      return ['APPROVED', 'REJECTED'];
    }

    return ['PENDING', 'APPROVED', 'REJECTED'];
  }

  ngOnInit(): void {
    // Cargar recursos iniciales
    this.store.dispatch(loadResources({ size: 20 }));

    // Setup debounced search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.store.dispatch(loadResources({ name: term, size: 20 }));
    });

    // Detectar si es edición
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.requestId = +idParam;
      this.store.dispatch(findById({ id: this.requestId }));
      
      this.store.select(selectRequestState).pipe(
        filter(state => !!state.selectedRequest && state.selectedRequest.id === this.requestId),
        take(1)
      ).subscribe(state => {
        const req = state.selectedRequest!;
        this.initialResourceName = req.resourceName || '';
        this.requestForm.patchValue({
          applicantName: req.applicantName,
          applicantEmail: req.applicantEmail,
          resourceId: req.resourceId,
          status: req.status
        });
      });
    }
  }

  onResourceSearch(term: string) {
    this.searchSubject.next(term);
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      const val = this.requestForm.value;
      const payload = {
        applicantName: val.applicantName!,
        applicantEmail: val.applicantEmail!,
        resourceId: val.resourceId!,
        status: val.status as RequestStatus
      };

      if (this.requestId) {
        this.store.dispatch(updateRequest({ id: this.requestId, request: payload }));
      } else {
        this.store.dispatch(createRequest({ request: payload }));
      }
    }
  }
}
