import {
  Component,
  EventEmitter,
  Output,
  Input,
  signal,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  parsePhoneNumber,
  CountryCode,
  getCountries,
  getCountryCallingCode,
} from 'libphonenumber-js';
import * as countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { ModalHeaderComponent } from '../../../../../../shared/ui/modal-header/modal-header.component';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { FormErrorComponent } from '../../../../../../shared/ui/form-error/form-error.component';
import { InputComponent } from '../../../../../../shared/ui/input/input.component';

interface CountryOption {
  code: CountryCode;
  dialCode: string;
  flag: string;
  name: string;
}

// Convert ISO country code to emoji flag
const countryCodeToFlag = (countryCode: string): string =>
  countryCode
    .toUpperCase()
    .split('')
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('');

@Component({
  selector: 'app-edit-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalHeaderComponent,
    InputComponent,
    ButtonComponent,
    FormErrorComponent,
  ],
  templateUrl: './edit-user-profile.component.html',
  styleUrl: './edit-user-profile.component.scss',
})
export class EditUserProfileComponent implements OnChanges {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Input() userData?: any;
  private _hasPrefilled = false;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  protected readonly statusIcon = 'icons/camera.png';
  profileForm: FormGroup;
  profileImage = signal(
    'https://ui-avatars.com/api/?name=User&background=FF6B35&color=fff&size=128'
  );

  countries: CountryOption[] = [];

  constructor(private fb: FormBuilder) {
    countries.registerLocale(enLocale);
    this.countries = this.generateCountriesList();

    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+233', Validators.required],
      phoneNumber: ['', [this.phoneValidator.bind(this)]],
      address: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('[EditUserProfile] ngOnChanges triggered', changes);

    if (changes['userData']) {
      const currentValue = changes['userData'].currentValue;
      console.log('[EditUserProfile] userData changed to:', currentValue);

      if (currentValue) {
        console.log('[EditUserProfile] Calling prefillForm...');
        this.prefillForm(currentValue);
        console.log('[EditUserProfile] prefillForm completed');
      }
    }
  }
  private generateCountriesList(): CountryOption[] {
    const allCountries = getCountries();
    return allCountries
      .map((code) => {
        try {
          const dialCode = `+${getCountryCallingCode(code)}`;
          const name = countries.getName(code, 'en') || code;
          return { code, dialCode, flag: countryCodeToFlag(code), name };
        } catch {
          return null;
        }
      })
      .filter((c): c is CountryOption => c !== null)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private prefillForm(user: any) {
    console.log('[EditUserProfile] prefillForm called with user:', user);

    let countryCode = '+233';
    let phoneNumber = user.phone || user.phoneNumber || '';

    console.log('[EditUserProfile] Initial phone:', phoneNumber);

    if (phoneNumber) {
      try {
        const parsed = parsePhoneNumber(phoneNumber);
        console.log('[EditUserProfile] Parsed phone:', parsed);
        if (parsed) {
          countryCode = `+${parsed.countryCallingCode}`;
          phoneNumber = parsed.nationalNumber;
          console.log(
            '[EditUserProfile] Extracted - countryCode:',
            countryCode,
            'phoneNumber:',
            phoneNumber
          );
        }
      } catch (e) {
        console.warn('Failed to parse phone number:', e);
        // Fallback: if it starts with +, try to split it
        if (phoneNumber.startsWith('+')) {
          const match = phoneNumber.match(/^(\+\d{1,4})(.*)$/);
          if (match) {
            countryCode = match[1];
            phoneNumber = match[2];
            console.log(
              '[EditUserProfile] Regex extracted - countryCode:',
              countryCode,
              'phoneNumber:',
              phoneNumber
            );
          }
        }
      }
    }

    const formValues = {
      fullName: user.fullName || '',
      email: user.email || '',
      countryCode,
      phoneNumber,
      address: user.address || '',
    };

    console.log('[EditUserProfile] Form values to patch:', formValues);
    console.log('[EditUserProfile] Form before patch:', this.profileForm.value);

    this.profileForm.patchValue(formValues);

    console.log('[EditUserProfile] Form after patch:', this.profileForm.value);

    this.profileImage.set(
      user.profileImageUrl || user.avatar || this.profileImage()
    );

    console.log('[EditUserProfile] Profile image set to:', this.profileImage());
  }

  // Validate phone numbers
  phoneValidator(control: AbstractControl): ValidationErrors | null {
    const phoneNumber = control.value;
    if (!phoneNumber) return null;

    const countryCode = this.profileForm?.get('countryCode')?.value || '+233';
    const cleanNumber = phoneNumber.replace(/[^\d]/g, '');
    if (cleanNumber.length < 7 || cleanNumber.length > 15)
      return { invalidPhone: 'Please enter a valid phone number' };

    try {
      const country = this.countries.find((c) => c.dialCode === countryCode);
      if (!country) return { invalidPhone: 'Invalid country code' };
      const fullNumber = `${countryCode}${cleanNumber}`;
      const phoneNumberObj = parsePhoneNumber(fullNumber, country.code);
      if (!phoneNumberObj || !phoneNumberObj.isValid())
        return { invalidPhone: 'Invalid phone number for selected country' };
      return null;
    } catch {
      return { invalidPhone: 'Invalid phone number format' };
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) this.profileImage.set(e.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onCountryCodeChange() {
    const phoneControl = this.profileForm.get('phoneNumber');
    if (phoneControl && phoneControl.value)
      phoneControl.updateValueAndValidity();
  }

  hasError(field: string): boolean {
    const ctrl = this.profileForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  getErrorMessage(field: string): string | null {
    const ctrl = this.profileForm.get(field);
    if (!ctrl || !this.hasError(field)) return null;
    if (ctrl.hasError('required')) return `${field} is required`;
    if (ctrl.hasError('email')) return 'Please enter a valid email';
    if (ctrl.hasError('invalidPhone')) return ctrl.getError('invalidPhone');
    return null;
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      console.log('[EditUserProfile] Form is invalid');
      return;
    }

    const formData = {
      ...this.userData, // Include all original user data
      ...this.profileForm.value, // Override with form values
      profileImageUrl: this.profileImage(), // Update profile image
    };

    console.log('[EditUserProfile] Emitting save data:', formData);
    this.save.emit(formData);
  }

  onCancel() {
    this.close.emit();
  }
}
