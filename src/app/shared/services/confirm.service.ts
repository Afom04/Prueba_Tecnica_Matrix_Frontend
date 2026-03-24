import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private confirmSubject = new Subject<{ options: ConfirmOptions, resolve: (result: boolean) => void }>();
  confirm$ = this.confirmSubject.asObservable();

  confirm(options: ConfirmOptions | string): Promise<boolean> {
    return new Promise((resolve) => {
      const opt = typeof options === 'string' ? { message: options } : options;
      this.confirmSubject.next({ options: opt, resolve });
    });
  }
}
