import {
  Component,
  EventEmitter,
  Output,
  Input,
  signal,
  ViewChild,
  ElementRef,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
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

interface CountryOption {
  readonly value: CountryCode;
  readonly label: string;
  readonly code: string;
}

@Component({
  selector: 'app-edit-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalHeaderComponent,
    InputComponent,
    ButtonComponent,
    NgOptimizedImage,
  ],
  templateUrl: './edit-user-profile.component.html',
  styleUrl: './edit-user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditUserProfileComponent implements OnInit {
  @Output() public readonly close = new EventEmitter<void>();
  @Output() public readonly save = new EventEmitter<any>();
  @Input() public userData?: any;

  @ViewChild('fileInput') private _fileInput!: ElementRef<HTMLInputElement>;

  protected readonly profileForm: FormGroup;
  protected readonly profileImage = signal<string>(
    'https://ui-avatars.com/api/?name=User&background=FF6B35&color=fff&size=128'
  );

  protected readonly statusIcon = 'icons/camera.png';

  private readonly _defaultCountryCode: CountryCode = 'GH';
  private readonly _maxImageSize = 5 * 1024 * 1024;

  protected readonly phoneCodes: readonly CountryOption[] = [
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

  private readonly _fieldLabels: Record<string, string> = {
    fullName: 'Full Name',
    email: 'Email',
    phoneNumber: 'Phone Number',
  };

  constructor(private readonly _fb: FormBuilder) {
    this.profileForm = this._fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneCode: [this._defaultCountryCode],
      phoneNumber: ['', [this._phoneNumberValidator.bind(this)]],
      address: [''],
    });

    this.profileForm.get('phoneCode')?.valueChanges.subscribe(() => {
      this.profileForm.get('phoneNumber')?.updateValueAndValidity();
    });
  }

  public ngOnInit(): void {
    if (this.userData) {
      this.profileForm.patchValue(this.userData);
      if (this.userData.profileImage) {
        this.profileImage.set(this.userData.profileImage);
      }
    }
  }

  protected triggerFileInput(): void {
    this._fileInput.nativeElement.click();
  }

  protected onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > this._maxImageSize) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.profileImage.set(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  protected hasError(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  protected getErrorMessage(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (!field) return '';

    const fieldLabel = this._fieldLabels[fieldName] || fieldName;

    if (field.hasError('required')) {
      return `${fieldLabel} is required`;
    }
    if (field.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field.hasError('minlength')) {
      const minLength = field.getError('minlength').requiredLength;
      return `${fieldLabel} must be at least ${minLength} characters`;
    }
    if (field.hasError('invalidPhone')) {
      return field.getError('invalidPhone');
    }

    return '';
  }

  protected getFormattedPhoneNumber(): string {
    const phoneNumber = this.profileForm.get('phoneNumber')?.value;
    const countryCode = this.profileForm.get('phoneCode')?.value as CountryCode;

    if (!phoneNumber || !countryCode) return '';

    try {
      const phoneNumberObj = parsePhoneNumber(phoneNumber, countryCode);
      if (phoneNumberObj && phoneNumberObj.isValid()) {
        return phoneNumberObj.formatInternational();
      }
    } catch {
      // Return original if parsing fails
    }

    return phoneNumber;
  }

  protected onSubmit(): void {
    if (this.profileForm.valid) {
      const phoneNumber = this.profileForm.get('phoneNumber')?.value;
      const countryCode = this.profileForm.get('phoneCode')
        ?.value as CountryCode;
      let formattedPhone = phoneNumber;

      if (phoneNumber && countryCode) {
        try {
          const phoneNumberObj = parsePhoneNumber(phoneNumber, countryCode);
          if (phoneNumberObj && phoneNumberObj.isValid()) {
            formattedPhone = phoneNumberObj.number;
          }
        } catch {
          // Silently fail and use original phone number
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

  protected onCancel(): void {
    this.close.emit();
  }

  private _phoneNumberValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const phoneNumber = control.value;
    if (!phoneNumber) return null;

    const countryCode = this.profileForm?.get('phoneCode')
      ?.value as CountryCode;
    if (!countryCode) {
      return { invalidPhone: 'Country code is required' };
    }

    try {
      const phoneNumberObj = parsePhoneNumber(phoneNumber, countryCode);
      if (!phoneNumberObj || !phoneNumberObj.isValid()) {
        return {
          invalidPhone: 'Phone number is not valid for the selected country',
        };
      }
      return null;
    } catch {
      return { invalidPhone: 'Invalid phone number format' };
    }
  }
}
