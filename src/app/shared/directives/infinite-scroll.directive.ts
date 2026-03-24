import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  private element = inject(ElementRef);

  @Input() threshold = '0px';
  @Output() scrolled = new EventEmitter<void>();

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.scrolled.emit();
          }
        });
      },
      {
        rootMargin: this.threshold
      }
    );

    this.observer.observe(this.element.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
