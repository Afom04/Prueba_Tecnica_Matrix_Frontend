import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'errorTranslate',
  standalone: true,
  pure: false
})
export class ErrorTranslatePipe implements PipeTransform {
  private translate = inject(TranslateService);

  transform(value: string | null): string {
    if (!value) return '';
    
    // Check if it's a combined key
    if (value.includes('|')) {
      const [prefix, messageKey] = value.split('|');
      const translatedPrefix = this.translate.instant(prefix);
      const translatedMessage = this.translate.instant(messageKey);
      
      // If the prefix wasn't found (returns the key), just return the message
      if (translatedPrefix === prefix) {
        return translatedMessage;
      }
      
      return `${translatedPrefix}${translatedMessage}`;
    }
    
    // Fallback to normal translation
    return this.translate.instant(value);
  }
}
