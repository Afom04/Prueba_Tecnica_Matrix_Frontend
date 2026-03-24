import { HttpErrorResponse } from '@angular/common/http';

export function mapHttpErrorToKey(error: any, prefix?: string): string {
  const messageKey = getMessageKeyFromError(error);
  return prefix ? `${prefix}|${messageKey}` : messageKey;
}

function getMessageKeyFromError(error: any): string {
  if (!(error instanceof HttpErrorResponse)) {
    if (error && error.status !== undefined) {
      return getMessageKey(error.status);
    }
    return 'ERRORS.GENERIC';
  }

  return getMessageKey(error.status);
}

function getMessageKey(status: number): string {
  switch (status) {
    case 0:
      return 'ERRORS.SERVER_UNREACHABLE';
    case 401:
      return 'ERRORS.UNAUTHORIZED';
    case 403:
      return 'ERRORS.UNAUTHORIZED';
    case 404:
      return 'ERRORS.NOT_FOUND';
    case 500:
      return 'ERRORS.INTERNAL_SERVER_ERROR';
    default:
      return 'ERRORS.GENERIC';
  }
}
