import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ConfirmService } from '../../services/confirm.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="overlay" *ngIf="visible" @fade>
      <div class="modal-card" @scale>
        <div class="modal-header" *ngIf="options?.title">
          <h3>{{ options?.title }}</h3>
        </div>
        <div class="modal-body">
          <p>{{ options?.message || '¿Estás seguro?' }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" (click)="handleAction(false)">
            {{ options?.cancelText || ('COMMON.CANCEL' | translate) || 'Cancelar' }}
          </button>
          <button class="btn-confirm" (click)="handleAction(true)">
            {{ options?.confirmText || ('COMMON.CONFIRM' | translate) || 'Confirmar' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 1rem;
    }

    .modal-card {
      background: white;
      border-radius: 16px;
      width: 100%;
      max-width: 450px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.25);
      overflow: hidden;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      padding: 1.5rem 1.5rem 0.5rem;
      h3 {
        margin: 0;
        font-size: 1.25rem;
        color: #1a1a1a !important;
      }
    }

    .modal-body {
      padding: 1.5rem;
      p {
        margin: 0;
        color: #444 !important;
        line-height: 1.6;
        font-size: 1.1rem;
      }
    }

    .modal-footer {
      padding: 1rem 1.5rem 1.5rem;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;

      button {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        font-family: inherit;
      }

      .btn-cancel {
        background: #f1f3f5;
        color: #495057 !important;
        &:hover { background: #e9ecef; }
      }

      .btn-confirm {
        background: #ff4d4f;
        color: white !important;
        box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
        &:hover { 
          background: #ff7875;
          transform: translateY(-1px);
        }
        &:active { transform: translateY(0); }
      }
    }
  `],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('scale', [
      transition(':enter', [
        style({ transform: 'scale(0.9)', opacity: 0 }),
        animate('200ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ transform: 'scale(0.95)', opacity: 0 }))
      ])
    ])
  ]
})
export class ConfirmDialogComponent implements OnInit {
  private confirmService = inject(ConfirmService);
  private cdr = inject(ChangeDetectorRef);

  visible = false;
  options: any = null;
  private currentResolve: ((result: boolean) => void) | null = null;

  ngOnInit() {
    this.confirmService.confirm$.subscribe(({ options, resolve }) => {
      this.options = options;
      this.currentResolve = resolve;
      this.visible = true;
      this.cdr.detectChanges();
    });
  }

  handleAction(result: boolean) {
    this.visible = false;
    if (this.currentResolve) {
      this.currentResolve(result);
      this.currentResolve = null;
    }
    this.cdr.detectChanges();
  }
}
