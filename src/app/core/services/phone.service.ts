import {
  Component,
  EventEmitter,
  Output,
  Input,
  signal,
  ViewChild,
  ElementRef,
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

@Component({
  selector: 'app-edit-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-user-profile.component.html',
  styleUrl: './edit-user-profile.component.scss',
})
export class EditUserProfileComponent {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Input() userData?: any;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  profileForm: FormGroup;
  profileImage = signal(
    'https://ui-avatars.com/api/?name=User&background=FF6B35&color=fff&size=128'
  );

  phoneCodes = [
    { value: 'GH', label: '+233 (Ghana)', code: '+233' },
    { value: 'NG', label: '+234 (Nigeria)', code: '+234' },
    { value: 'US', label: '+1 (United States)', code: '+1' },
    { value: 'GB', label: '+44 (United Kingdom)', code: '+44' },
    { value: 'IN', label: '+91 (India)', code: '+91' },
    { value: 'KE', label: '+254 (Kenya)', code: '+254' },
    { value: 'ZA', label: '+27 (South Africa)', code: '+27' },
    { value: 'EG', label: '+20 (Egypt)', code: '+20' },
    { value: 'CA', label: '+1 (Canada)', code: '+1' },
    { value: 'AU', label: '+61 (Australia)', code: '+61' },
  ];

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneCode: ['GH'],
      phoneNumber: ['', [this.phoneNumberValidator.bind(this)]],
      address: [''],
      website: ['', [this.urlValidator]],
      facebook: [''],
      instagram: [''],
    });

    // Re-validate phone number when country code changes
    this.profileForm.get('phoneCode')?.valueChanges.subscribe(() => {
      this.profileForm.get('phoneNumber')?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    if (this.userData) {
      this.profileForm.patchValue(this.userData);
      if (this.userData.profileImage) {
        this.profileImage.set(this.userData.profileImage);
      }
    }
  }

  // Phone Number Validator using libphonenumber-js
  phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
    const phoneNumber = control.value;

    if (!phoneNumber) {
      return null; // Allow empty (use Validators.required separately if needed)
    }

    const countryCode = this.profileForm?.get('phoneCode')
      ?.value as CountryCode;

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
          invalidPhone: 'Phone number is not valid for the selected country',
        };
      }

      return null;
    } catch (error) {
      return { invalidPhone: 'Invalid phone number format' };
    }
  }

  // URL Validator
  urlValidator(control: AbstractControl): ValidationErrors | null {
    const url = control.value;

    if (!url) {
      return null; // Allow empty
    }

    try {
      const urlPattern =
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(url)) {
        return { invalidUrl: 'Please enter a valid URL' };
      }
      return null;
    } catch {
      return { invalidUrl: 'Invalid URL format' };
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.profileImage.set(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  hasError(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (field.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field.hasError('minLength')) {
      const minLength = field.getError('minLength').requiredLength;
      return `${this.getFieldLabel(
        fieldName
      )} must be at least ${minLength} characters`;
    }
    if (field.hasError('invalidPhone')) {
      return field.getError('invalidPhone');
    }
    if (field.hasError('invalidUrl')) {
      return field.getError('invalidUrl');
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      fullName: 'Full Name',
      username: 'Username',
      email: 'Email',
      phoneNumber: 'Phone Number',
      website: 'Website',
    };
    return labels[fieldName] || fieldName;
  }

  // Format phone number for display
  getFormattedPhoneNumber(): string {
    const phoneNumber = this.profileForm.get('phoneNumber')?.value;
    const countryCode = this.profileForm.get('phoneCode')?.value as CountryCode;

    if (!phoneNumber || !countryCode) {
      return '';
    }

    try {
      const phoneNumberObj = parsePhoneNumber(phoneNumber, countryCode);
      if (phoneNumberObj && phoneNumberObj.isValid()) {
        return phoneNumberObj.formatInternational();
      }
    } catch (error) {
      // Return original if parsing fails
    }

    return phoneNumber;
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const countryCode = this.profileForm.get('phoneCode')
        ?.value as CountryCode;
      const phoneNumber = this.profileForm.get('phoneNumber')?.value;

      let formattedPhone = phoneNumber;

      // Format phone number to international format
      if (phoneNumber && countryCode) {
        try {
          const phoneNumberObj = parsePhoneNumber(phoneNumber, countryCode);
          if (phoneNumberObj && phoneNumberObj.isValid()) {
            formattedPhone = phoneNumberObj.number; // E.164 format
          }
        } catch (error) {
          console.error('Error formatting phone number:', error);
        }
      }

      const formData = {
        ...this.profileForm.value,
        phoneNumber: formattedPhone,
        profileImage: this.profileImage(),
      };

      this.save.emit(formData);
    }
  }

  onCancel() {
    this.close.emit();
  }
}
