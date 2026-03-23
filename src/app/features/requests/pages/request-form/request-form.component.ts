import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { createRequest, updateRequest, findById } from '../../store/request.actions';
import { loadResources } from '../../../resources/store/resource.actions';
import { selectAllResources } from '../../../resources/store/resource.selectors';
import { selectRequestState } from '../../store/request.selectors';
import { filter, take } from 'rxjs/operators';
import { RequestStatus } from '../../models/request.model';

@Component({
  selector: 'app-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
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
  loading$ = this.store.select(state => (state as any).requests.loading);

  requestForm = this.fb.group({
    applicantName: ['', Validators.required],
    applicantEmail: ['', [Validators.required, Validators.email]],
    resourceId: [null as number | null, Validators.required],
    status: ['PENDING' as RequestStatus]
  });

  ngOnInit(): void {
    // Cargar recursos para el dropdown
    this.store.dispatch(loadResources({}));

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
        this.requestForm.patchValue({
          applicantName: req.applicantName,
          applicantEmail: req.applicantEmail,
          resourceId: req.resourceId,
          status: req.status
        });
      });
    }
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
      this.router.navigate(['/requests']);
    }
  }
}
