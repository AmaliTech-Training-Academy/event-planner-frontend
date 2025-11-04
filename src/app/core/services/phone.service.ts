import { Injectable } from '@angular/core';
import {
  parsePhoneNumber,
  CountryCode,
  isValidPhoneNumber,
  getCountries,
  getCountryCallingCode,
  PhoneNumber,
} from 'libphonenumber-js';

export interface PhoneCountry {
  value: CountryCode;
  label: string;
  code: string;
}

@Injectable({
  providedIn: 'root',
})
export class PhoneService {
  getPopularCountries(): PhoneCountry[] {
    return [
      { value: 'GH', label: '+233 (Ghana)', code: '+233' },
      { value: 'NG', label: '+234 (Nigeria)', code: '+234' },
      { value: 'KE', label: '+254 (Kenya)', code: '+254' },
      { value: 'ZA', label: '+27 (South Africa)', code: '+27' },
      { value: 'EG', label: '+20 (Egypt)', code: '+20' },
      { value: 'US', label: '+1 (United States)', code: '+1' },
      { value: 'GB', label: '+44 (United Kingdom)', code: '+44' },
      { value: 'CA', label: '+1 (Canada)', code: '+1' },
      { value: 'IN', label: '+91 (India)', code: '+91' },
      { value: 'AU', label: '+61 (Australia)', code: '+61' },
    ];
  }

  getAllCountries(): PhoneCountry[] {
    return getCountries()
      .map((country) => ({
        value: country,
        label: `+${getCountryCallingCode(country)} (${this.getCountryName(
          country
        )})`,
        code: `+${getCountryCallingCode(country)}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  isValidNumber(phoneNumber: string, countryCode: CountryCode): boolean {
    try {
      return isValidPhoneNumber(phoneNumber, countryCode);
    } catch {
      return false;
    }
  }

  parseNumber(
    phoneNumber: string,
    countryCode: CountryCode
  ): PhoneNumber | null {
    try {
      return parsePhoneNumber(phoneNumber, countryCode);
    } catch {
      return null;
    }
  }

  formatToInternational(phoneNumber: string, countryCode: CountryCode): string {
    return this.tryFormat(phoneNumber, countryCode, (p) =>
      p.formatInternational()
    );
  }

  formatToNational(phoneNumber: string, countryCode: CountryCode): string {
    return this.tryFormat(phoneNumber, countryCode, (p) => p.formatNational());
  }

  formatToE164(phoneNumber: string, countryCode: CountryCode): string {
    return this.tryFormat(phoneNumber, countryCode, (p) => p.number);
  }

  getNumberType(
    phoneNumber: string,
    countryCode: CountryCode
  ): string | undefined {
    try {
      const parsed = parsePhoneNumber(phoneNumber, countryCode);
      return parsed?.getType();
    } catch {
      return undefined;
    }
  }

  extractCountryFromNumber(phoneNumber: string): CountryCode | undefined {
    try {
      return parsePhoneNumber(phoneNumber)?.country;
    } catch {
      return undefined;
    }
  }

  cleanNumber(phoneNumber: string): string {
    return phoneNumber.replace(/[^\d+]/g, '');
  }

  private tryFormat(
    phoneNumber: string,
    countryCode: CountryCode,
    formatter: (p: PhoneNumber) => string
  ): string {
    try {
      const parsed = parsePhoneNumber(phoneNumber, countryCode);
      return parsed ? formatter(parsed) : phoneNumber;
    } catch {
      return phoneNumber;
    }
  }

  private getCountryName(countryCode: CountryCode): string {
    const countryNames: Record<string, string> = {
      GH: 'Ghana',
      NG: 'Nigeria',
      KE: 'Kenya',
      ZA: 'South Africa',
      EG: 'Egypt',
      US: 'United States',
      GB: 'United Kingdom',
      CA: 'Canada',
      IN: 'India',
      AU: 'Australia',
    };
    return countryNames[countryCode] || countryCode;
  }
}
