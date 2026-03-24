import { Component, Input, Output, EventEmitter, forwardRef, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="autocomplete-container" #container>
      <div class="input-wrapper">
        <input
          type="text"
          [placeholder]="placeholder"
          [value]="displayValue"
          (input)="onInput($event)"
          (focus)="onFocus()"
          [disabled]="disabled"
          [readonly]="selectedValue !== null"
          autocomplete="off"
        />
        <div *ngIf="loading" class="spinner-small"></div>
        <button *ngIf="displayValue && !disabled" type="button" class="clear-btn" (click)="clear()">✕</button>
      </div>

      <div class="results-dropdown" *ngIf="showDropdown">
        <div *ngIf="loading" class="dropdown-status">Cargando...</div>
        
        <ng-container *ngIf="!loading">
          <div
            class="result-item"
            *ngFor="let option of filteredOptions"
            (click)="selectOption(option)"
          >
            {{ option[labelKey] }}
          </div>
          
          <div class="dropdown-status no-results" *ngIf="filteredOptions.length === 0 && lastSearchTerm">
            No se encontraron resultados
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .autocomplete-container {
      position: relative;
      width: 100%;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;

      input {
        width: 100%;
        padding: 0.75rem;
        padding-right: 2.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        font-family: inherit;

        &:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }

        &:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
        }

        &[readonly] {
          background-color: #f0f7ff;
          cursor: default;
          border-color: #b8daff;
        }
      }

      .spinner-small {
        position: absolute;
        right: 2.5rem;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(0,0,0,0.1);
        border-top: 2px solid #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .clear-btn {
        position: absolute;
        right: 0.75rem;
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        font-size: 1.2rem;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          color: #666;
        }
      }
    }

    .results-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 1010;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-top: 4px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      max-height: 250px;
      overflow-y: auto;
    }

    .dropdown-status {
      padding: 1rem;
      color: #666;
      font-style: italic;
      text-align: center;
    }

    .result-item {
      padding: 0.75rem 1rem;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: #f0f7ff;
        color: #0056b3;
      }

      &:not(:last-child) {
        border-bottom: 1px solid #f0f0f0;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    }
  ]
})
export class AutocompleteComponent implements ControlValueAccessor {
  @Input() options: any[] = [];
  @Input() labelKey: string = 'name';
  @Input() valueKey: string = 'id';
  @Input() placeholder: string = 'Buscar...';
  @Input() loading: boolean = false;
  @Input() initialDisplayValue: string = '';

  @Output() query = new EventEmitter<string>();

  @ViewChild('container') container!: ElementRef;

  displayValue: string = '';
  selectedValue: any = null;
  showDropdown: boolean = false;
  disabled: boolean = false;
  lastSearchTerm: string = '';

  get filteredOptions() {
    if (!this.lastSearchTerm || this.selectedValue) return this.options;
    const term = this.lastSearchTerm.toLowerCase();
    return this.options.filter(opt => 
      opt[this.labelKey].toLowerCase().includes(term)
    );
  }

  private onChange: any = () => {};
  private onTouched: any = () => {};

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.container.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  onInput(event: any) {
    const value = event.target.value;
    
    // If we have a selection and the value changed, it means the user is typing/editing
    // But since we have [readonly], this case only happens if the dev removes [readonly]
    // or through some other interaction. We sync displayValue.
    this.displayValue = value;
    
    if (this.selectedValue) {
      this.selectedValue = null;
      this.onChange(null);
    }
    
    this.lastSearchTerm = value;
    this.query.emit(value);
    this.showDropdown = true;
  }

  onFocus() {
    if (this.displayValue || this.options.length > 0) {
      this.showDropdown = true;
    }
    this.onTouched();
  }

  selectOption(option: any) {
    this.selectedValue = option[this.valueKey];
    this.displayValue = option[this.labelKey];
    this.showDropdown = false;
    this.onChange(this.selectedValue);
  }

  clear() {
    this.displayValue = '';
    this.selectedValue = null;
    this.lastSearchTerm = '';
    this.showDropdown = false;
    this.onChange(null);
    this.query.emit('');
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.selectedValue = value;
    // We don't update displayValue here because we might not have the options list yet.
    // The parent component should pass initialDisplayValue if needed.
    if (this.initialDisplayValue) {
      this.displayValue = this.initialDisplayValue;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnChanges(changes: any) {
    if (changes.initialDisplayValue && changes.initialDisplayValue.currentValue) {
      this.displayValue = changes.initialDisplayValue.currentValue;
    }
  }
}
