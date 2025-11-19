import { AbstractControl } from '@angular/forms';

export function getControlError(control: AbstractControl | null): string | null {
  if (!control) return null;
  if (control.disabled) return null;
  const touchedOrDirty = control.touched || control.dirty;
  if (!touchedOrDirty || control.valid) return null;

  const errors = control.errors || {};

  if (errors['required']) return 'This field is required';
  if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength}`;
  if (errors['maxlength']) return `Maximum length is ${errors['maxlength'].requiredLength}`;
  if (errors['min']) return `Value must be at least ${errors['min'].min}`;
  if (errors['max']) return `Value must be at most ${errors['max'].max}`;
  if (errors['pattern']) return 'Please enter a valid value';

  return 'Invalid field value';
}


