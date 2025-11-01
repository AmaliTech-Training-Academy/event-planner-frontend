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
import { parsePhoneNumber, CountryCode } from 'libphonenumber-js';
import { ModalHeaderComponent } from '../../../../../../shared/ui/modal-header/modal-header.component';
import { InputComponent } from '../../../../../../shared/ui/input/input.component';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';

@Component({
  selector: 'app-edit-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalHeaderComponent, InputComponent, ButtonComponent],
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
  defaultCountryCode: CountryCode = 'GH';

  phoneCodes = [
    { value: 'GH', label: 'Ghana', code: '+233' },
    { value: 'NG', label: 'Nigeria', code: '+234' },
    { value: 'KE', label: 'Kenya', code: '+254' },
    { value: 'ZA', label: 'South Africa', code: '+27' },
    { value: 'EG', label: 'Egypt', code: '+20' },
    { value: 'US', label: 'United States', code: '+1' },
    { value: 'GB', label: 'United Kingdom', code: '+44' },
    { value: 'CA', label: 'Canada', code: '+1' },
    { value: 'IN', label: 'India', code: '+91' },
    { value: 'AU', label: 'Australia', code: '+61' },
  ];

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneCode: ['GH'],
      phoneNumber: ['', [this.phoneNumberValidator.bind(this)]],
      address: [''],
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

  // Phone Number Validator using country code from select
  phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
    const phoneNumber = control.value;

    if (!phoneNumber) {
      return null; // Allow empty
    }

    const countryCode = this.profileForm?.get('phoneCode')
      ?.value as CountryCode;

    if (!countryCode) {
      return { invalidPhone: 'Country code is required' };
    }

    try {
      const phoneNumberObj = parsePhoneNumber(phoneNumber, countryCode);

      if (!phoneNumberObj) {
        return { invalidPhone: 'Invalid phone number format' };
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
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      fullName: 'Full Name',
      email: 'Email',
      phoneNumber: 'Phone Number',
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
      const phoneNumber = this.profileForm.get('phoneNumber')?.value;
      const countryCode = this.profileForm.get('phoneCode')
        ?.value as CountryCode;

      let formattedPhone = phoneNumber;

      // Format phone number to E.164 format
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
