import {
  Component,
  EventEmitter,
  Output,
  signal,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  input,
  effect,
  computed,
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
import { finalize } from 'rxjs';
import { ModalHeaderComponent } from '../../../../../../shared/ui/modal-header/modal-header.component';
import { InputComponent } from '../../../../../../shared/ui/input/input.component';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { UserManagementService } from '../../../../../../core/services/user-management.service';

import { UpdateUserPayload } from '../../../../../../core/services/backend/user-backend.service';
import { User } from '../../../../../../core/models';

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
export class EditUserProfileComponent {
  @Output() public readonly close = new EventEmitter<void>();
  @Output() public readonly save = new EventEmitter<User>();
  public readonly userData = input<User>();

  @ViewChild('fileInput') private _fileInput!: ElementRef<HTMLInputElement>;

  protected readonly profileForm: FormGroup;
  protected readonly profileImage = signal<string>('images/profile-image.png');
  protected readonly saving = signal<boolean>(false);
  protected readonly uploadingImage = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  protected readonly statusIcon = 'icons/camera.png';

  private readonly _defaultCountryCode: CountryCode = 'GH';
  private readonly _maxImageSize = 5 * 1024 * 1024;
  private _selectedImageFile: File | null = null;
  private _originalImageUrl: string | null = null;
  private _newImageBase64: string | null = null;

  protected readonly currentProfileImage = computed(() => {
    const user = this.userData();
    const name = user?.fullName || user?.name || 'User';
    return (
      user?.profileImageUrl ||
      user?.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=FF6B35&color=fff&size=128`
    );
  });

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
    phone: 'Phone Number',
  };

  constructor(
    private readonly _fb: FormBuilder,
    private readonly userManagementService: UserManagementService
  ) {
    this.profileForm = this._fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneCode: [this._defaultCountryCode],
      phone: ['', [this._phoneNumberValidator.bind(this)]],
      address: [''],
    });

    this.profileForm.get('phoneCode')?.valueChanges.subscribe(() => {
      this.profileForm.get('phone')?.updateValueAndValidity();
    });

    effect(() => {
      const user = this.userData();
      if (user) {
        this._initializeForm();
        this._initializeProfileImage();
      } else {
        this.profileForm.reset();
        this.profileImage.set(
          'https://ui-avatars.com/api/?name=User&background=FF6B35&color=fff&size=128'
        );
      }
    });
  }

  private _initializeForm(): void {
    const user = this.userData();

    if (!user) {
      return;
    }

    console.log('📋 User data for form:', user); // Debug

    if (user.phone) {
      try {
        const parsed = parsePhoneNumber(user.phone);
        if (parsed) {
          const formData = {
            fullName: user.fullName || user.name || '',
            email: user.email,
            phoneCode: parsed.country || this._defaultCountryCode,
            phone: parsed.nationalNumber.toString(), // ✅ Convert to string
            address: user.address || '',
          };

          console.log('✅ Form data with parsed phone:', formData); // Debug
          this.profileForm.patchValue(formData, { emitEvent: false });
          return;
        }
      } catch (error) {
        console.error('❌ Phone parsing error:', error);
      }
    }

    // Fallback for users without phone or parsing failure
    const formData = {
      fullName: user.fullName || user.name || '',
      email: user.email,
      phoneCode: this._defaultCountryCode,
      phone: user.phone || '',
      address: user.address || '',
    };

    console.log('✅ Form data (fallback):', formData); // Debug
    this.profileForm.patchValue(formData, { emitEvent: false });
  }

  private _initializeProfileImage(): void {
    const imageUrl = this.currentProfileImage();
    this._originalImageUrl = imageUrl;
    this.profileImage.set(imageUrl);
  }

  protected triggerFileInput(): void {
    this._fileInput.nativeElement.click();
  }

  protected onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];

    if (!this._validateImageFile(file)) return;

    // ⚠️ Temporarily disable profile picture upload
    this.error.set(
      'Profile picture updates are temporarily unavailable. Please update other details.'
    );

    // Reset the file input
    if (this._fileInput) {
      this._fileInput.nativeElement.value = '';
    }

    return;

    // TODO: Re-enable when backend FormData endpoint is fixed
    // this._selectedImageFile = file;
    // this.error.set(null);
    // this._convertImageToBase64(file);
  }

  private _validateImageFile(file: File): boolean {
    if (!file.type.startsWith('image/')) {
      this.error.set('Please select an image file');
      return false;
    }

    if (file.size > this._maxImageSize) {
      this.error.set('Image size should be less than 5MB');
      return false;
    }

    return true;
  }

  private _convertImageToBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const base64String = e.target.result as string;
        this._newImageBase64 = base64String;
        this.profileImage.set(base64String);
      }
    };
    reader.readAsDataURL(file);
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
    const phoneNumber = this.profileForm.get('phone')?.value;
    const countryCode = this.profileForm.get('phoneCode')?.value as CountryCode;

    if (!phoneNumber || !countryCode) return '';

    try {
      const phoneNumberObj = parsePhoneNumber(phoneNumber, countryCode);
      if (phoneNumberObj && phoneNumberObj.isValid()) {
        return phoneNumberObj.formatInternational();
      }
    } catch {}

    return phoneNumber;
  }

  protected onSubmit(): void {
    const user = this.userData();
    if (!this.profileForm.valid || !user?.userId) {
      this._markFormAsTouched();
      return;
    }

    if (this.saving()) return;

    this.saving.set(true);
    this.error.set(null);

    const updatePayload: UpdateUserPayload = this._buildUpdatePayload();

    this.userManagementService
      .updateUser(String(user.userId), updatePayload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          const updatedUser = response.data || response;
          this.save.emit(updatedUser);
          this._resetForm();
          this.close.emit();
        },
        error: (err) => {
          const errorMessage =
            err?.error?.message ||
            err?.message ||
            'Failed to update profile. Please try again.';
          this.error.set(errorMessage);
        },
      });
  }

  private _buildUpdatePayload(): UpdateUserPayload {
    const phoneNumber = this.profileForm.get('phone')?.value;
    const countryCode = this.profileForm.get('phoneCode')?.value as CountryCode;
    let formattedPhone = phoneNumber || ''; // ✅ Default to empty string

    if (phoneNumber && countryCode) {
      try {
        const phoneNumberObj = parsePhoneNumber(phoneNumber, countryCode);
        if (phoneNumberObj?.isValid()) {
          formattedPhone = phoneNumberObj.number;
        }
      } catch {}
    }

    const user = this.userData();
    if (!user) throw new Error('No user data available');

    const payload: UpdateUserPayload = {
      fullName: this.profileForm.value.fullName,
      email: this.profileForm.value.email,
      phone: formattedPhone, // ✅ Always string, never undefined
      address: this.profileForm.value.address || '', // ✅ Always string, never undefined
      status: user.status === 'Active',
    };

    // Include new profile image if uploaded
    if (this._newImageBase64) {
      payload.profilePicture = this._newImageBase64;
    }

    return payload;
  }

  private _markFormAsTouched(): void {
    Object.keys(this.profileForm.controls).forEach((key) => {
      this.profileForm.get(key)?.markAsTouched();
    });
  }

  private _resetForm(): void {
    this._selectedImageFile = null;
    this._originalImageUrl = null;
    this._newImageBase64 = null;
    this.profileForm.reset();
    this.error.set(null);
  }

  protected onCancel(): void {
    if (this._originalImageUrl) {
      this.profileImage.set(this._originalImageUrl);
    }
    this._resetForm();
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
