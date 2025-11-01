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

  /**
   * Get all countries with their calling codes
   */
  getAllCountries(): PhoneCountry[] {
    const countries = getCountries();
    return countries
      .map((country) => ({
        value: country,
        label: `+${getCountryCallingCode(country)} (${this.getCountryName(
          country
        )})`,
        code: `+${getCountryCallingCode(country)}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  /**
   * Validate phone number for a specific country
   */
  isValid(phoneNumber: string, countryCode: CountryCode): boolean {
    try {
      return isValidPhoneNumber(phoneNumber, countryCode);
    } catch {
      return false;
    }
  }

  /**
   * Parse phone number and return phone object
   */
  parse(phoneNumber: string, countryCode: CountryCode): PhoneNumber | null {
    try {
      return parsePhoneNumber(phoneNumber, countryCode);
    } catch {
      return null;
    }
  }

  /**
   * Format phone number to international format (e.g., +233 24 123 4567)
   */
  formatInternational(phoneNumber: string, countryCode: CountryCode): string {
    try {
      const parsed = parsePhoneNumber(phoneNumber, countryCode);
      return parsed ? parsed.formatInternational() : phoneNumber;
    } catch {
      return phoneNumber;
    }
  }

  /**
   * Format phone number to national format (e.g., 024 123 4567)
   */
  formatNational(phoneNumber: string, countryCode: CountryCode): string {
    try {
      const parsed = parsePhoneNumber(phoneNumber, countryCode);
      return parsed ? parsed.formatNational() : phoneNumber;
    } catch {
      return phoneNumber;
    }
  }

  /**
   * Format phone number to E.164 format (e.g., +233241234567)
   */
  formatE164(phoneNumber: string, countryCode: CountryCode): string {
    try {
      const parsed = parsePhoneNumber(phoneNumber, countryCode);
      return parsed ? parsed.number : phoneNumber;
    } catch {
      return phoneNumber;
    }
  }

  /**
   * Get phone number type (MOBILE, FIXED_LINE, etc.)
   */
  getType(phoneNumber: string, countryCode: CountryCode): string | undefined {
    try {
      const parsed = parsePhoneNumber(phoneNumber, countryCode);
      return parsed ? parsed.getType() : undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Extract country code from phone number
   */
  extractCountryCode(phoneNumber: string): CountryCode | undefined {
    try {
      const parsed = parsePhoneNumber(phoneNumber);
      return parsed ? parsed.country : undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Get country name from country code
   */
  private getCountryName(countryCode: CountryCode): string {
    const countryNames: { [key: string]: string } = {
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
      // Add more as needed
    };
    return countryNames[countryCode] || countryCode;
  }

  /**
   * Clean phone number (remove spaces, dashes, etc.)
   */
  cleanPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/[^\d+]/g, '');
  }
}
