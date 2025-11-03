import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { parsePhoneNumber, CountryCode } from 'libphonenumber-js';

export function phoneNumberValidator(
  countryCodeControl: AbstractControl
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const phoneNumber = control.value;

    if (!phoneNumber) {
      return null; // Allow empty (use Validators.required separately if needed)
    }

    const countryCode = countryCodeControl.value as CountryCode;

    if (!countryCode) {
      return { invalidPhone: 'Country code is required' };
    }

    try {
      const phoneNumberObj = parsePhoneNumber(phoneNumber, countryCode);

      if (!phoneNumberObj) {
        return { invalidPhone: 'Invalid phone number' };
      }

      if (!phoneNumberObj.isValid()) {
        return {
          invalidPhone: `Invalid ${getCountryName(countryCode)} phone number`,
        };
      }

      return null;
    } catch (error) {
      return { invalidPhone: 'Invalid phone number format' };
    }
  };
}

export function staticPhoneNumberValidator(
  countryCode: CountryCode
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const phoneNumber = control.value;

    if (!phoneNumber) {
      return null;
    }

    try {
      const phoneNumberObj = parsePhoneNumber(phoneNumber, countryCode);

      if (!phoneNumberObj || !phoneNumberObj.isValid()) {
        return {
          invalidPhone: `Invalid ${getCountryName(countryCode)} phone number`,
        };
      }

      return null;
    } catch (error) {
      return { invalidPhone: 'Invalid phone number format' };
    }
  };
}

export function internationalPhoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const phoneNumber = control.value;

    if (!phoneNumber) {
      return null;
    }

    try {
      const phoneNumberObj = parsePhoneNumber(phoneNumber);

      if (!phoneNumberObj || !phoneNumberObj.isValid()) {
        return {
          invalidPhone:
            'Invalid international phone number. Include country code (e.g., +233...)',
        };
      }

      return null;
    } catch (error) {
      return {
        invalidPhone:
          'Invalid phone number format. Include country code (e.g., +233...)',
      };
    }
  };
}

function getCountryName(countryCode: CountryCode): string {
  const countryNames: { [key: string]: string } = {
    GH: 'Ghanaian',
    NG: 'Nigerian',
    KE: 'Kenyan',
    ZA: 'South African',
    EG: 'Egyptian',
    US: 'US',
    GB: 'UK',
    CA: 'Canadian',
    IN: 'Indian',
    AU: 'Australian',
  };
  return countryNames[countryCode] || countryCode;
}
