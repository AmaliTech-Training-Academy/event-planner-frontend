import {
  Component,
  signal,
  OnInit,
  ViewChild,
  ElementRef,
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
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { LayoutService } from '../../../../core/services/layout.service';
import { AuthService } from '../../../../core/services/auth.service';
import { UserManagementService } from '../../../../core/services/user-management.service';
import { OtpBodyData } from '../../../../core/models/auth-response.model';

interface CountryOption {
  readonly value: CountryCode;
  readonly label: string;
  readonly code: string;
}

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    NgOptimizedImage,
  ],
  templateUrl: './admin-edit-profile.component.html',
  styleUrls: ['./admin-edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  @ViewChild('fileInput') private _fileInput!: ElementRef<HTMLInputElement>;

  protected readonly profileForm: FormGroup;
  protected readonly profileImage = signal<string>('');
  protected readonly saving = signal<boolean>(false);
  protected readonly uploadingImage = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly showPhoneField = signal<boolean>(false);
  protected readonly showAddressField = signal<boolean>(false);

  protected readonly statusIcon: string = 'icons/camera.png';

  private readonly _defaultCountryCode: CountryCode = 'GH';
  private readonly _maxImageSize: number = 5 * 1024 * 1024;
  private _selectedImageFile: File | null = null;
  private _originalImageUrl: string | null = null;
  private _currentUserId: string | null = null;

  protected readonly currentProfileImage = computed(() => {
    const user = this._authService.currentUser();
    const name = user?.fullName || 'Admin';
    return (
      user?.profilePicture ||
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
    emailAddress: 'Email Address',
    phone: 'Phone Number',
    address: 'Address',
  };

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _layoutService: LayoutService,
    private readonly _authService: AuthService,
    private readonly _userManagementService: UserManagementService
  ) {
    this.profileForm = this._fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      emailAddress: ['', [Validators.required, Validators.email]],
      phoneCode: [this._defaultCountryCode],
      phone: ['', [this._phoneNumberValidator.bind(this)]],
      address: [''],
    });

    this.profileForm.get('phoneCode')?.valueChanges.subscribe(() => {
      this.profileForm.get('phone')?.updateValueAndValidity();
    });

    effect(() => {
      const user = this._authService.currentUser();
      if (user) {
        this._initializeForm(user);
        this._initializeProfileImage();
      }
    });
  }

  public ngOnInit(): void {
    this._layoutService.pageTitle.set('Edit Profile');
    this._layoutService.logoSrc.set('icons/user-icon-orange.png');
    this._layoutService.logoAlt.set('Edit Profile Icon');

    const currentUser = this._authService.currentUser();
    if (currentUser?.id) {
      this._currentUserId = currentUser.id.toString();
      this._authService.checkAuthUser(this._currentUserId).subscribe();
    }
  }

  private _initializeForm(user: OtpBodyData): void {
    const formData: any = {
      fullName: user.fullName || '',
      emailAddress: user.email || '',
      phoneCode: this._defaultCountryCode,
      phone: '',
      address: '',
    };

    // Note: OtpBodyData doesn't have phone/address fields
    // If they exist in the full user object, parse phone number
    const userWithDetails = user as any;

    if (userWithDetails.phone) {
      try {
        const parsed = parsePhoneNumber(userWithDetails.phone);
        if (parsed) {
          formData.phoneCode = parsed.country || this._defaultCountryCode;
          formData.phone = parsed.nationalNumber.toString();
          this.showPhoneField.set(true);
        }
      } catch (error) {
        formData.phone = userWithDetails.phone || '';
        if (formData.phone) {
          this.showPhoneField.set(true);
        }
      }
    }

    if (userWithDetails.address) {
      formData.address = userWithDetails.address;
      this.showAddressField.set(true);
    }

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

    this._selectedImageFile = file;
    this.error.set(null);

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>): void => {
      if (e.target?.result) {
        this.profileImage.set(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
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

  protected togglePhoneField(): void {
    this.showPhoneField.set(!this.showPhoneField());
    if (!this.showPhoneField()) {
      this.profileForm.patchValue({
        phone: '',
        phoneCode: this._defaultCountryCode,
      });
    }
  }

  protected toggleAddressField(): void {
    this.showAddressField.set(!this.showAddressField());
    if (!this.showAddressField()) {
      this.profileForm.patchValue({ address: '' });
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

  public saveProfile(): void {
    if (!this.profileForm.valid || !this._currentUserId) {
      this._markFormAsTouched();
      return;
    }

    if (this.saving()) return;

    this.saving.set(true);
    this.error.set(null);

    const formData = this._buildFormData();

    this._userManagementService
      .updateUserWithFormData(this._currentUserId, formData)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          const updatedUser = response.data || response;

          // Update AuthService with new data
          const authData: OtpBodyData = {
            id: updatedUser.userId || parseInt(this._currentUserId!, 10),
            email: updatedUser.email,
            fullName: updatedUser.fullName || updatedUser.name,
            profilePicture: updatedUser.profileImageUrl || updatedUser.avatar,
            role: updatedUser.role,
          };

          this._authService['_userInfo$'].next(authData);
          this._authService['saveAuthToStorage'](
            authData.id.toString(),
            authData.fullName,
            authData.profilePicture,
            authData.email,
            authData.role
          );

          this._resetForm();
          this.error.set(null);

          // Show success message or navigate
          console.log('Profile updated successfully');
        },
        error: (err) => {
          if (
            err?.error?.message?.toLowerCase().includes('email already exists')
          ) {
            this.error.set(
              'This email is already in use. Please choose another.'
            );
          } else {
            const errorMessage =
              err?.error?.message ||
              err?.message ||
              'Failed to update profile. Please try again.';
            this.error.set(errorMessage);
          }
        },
      });
  }

  private _buildFormData(): FormData {
    const phoneNumber = this.profileForm.get('phone')?.value;
    const countryCode = this.profileForm.get('phoneCode')?.value as CountryCode;
    let formattedPhone = phoneNumber || '';

    if (phoneNumber && countryCode) {
      try {
        const phoneNumberObj = parsePhoneNumber(phoneNumber, countryCode);
        if (phoneNumberObj?.isValid()) {
          formattedPhone = phoneNumberObj.number;
        }
      } catch {}
    }

    const currentUser = this._authService.currentUser();
    if (!currentUser) throw new Error('No user data available');

    const userUpdateRequest = {
      fullName: this.profileForm.value.fullName,
      email: this.profileForm.value.emailAddress,
      phone: formattedPhone,
      address: this.profileForm.value.address || '',
      status: true, // Admin is always active
    };

    const formData = new FormData();
    formData.append('userUpdateRequest', JSON.stringify(userUpdateRequest));

    if (this._selectedImageFile) {
      formData.append('profilePicture', this._selectedImageFile);
    }

    return formData;
  }

  private _markFormAsTouched(): void {
    Object.keys(this.profileForm.controls).forEach((key) => {
      this.profileForm.get(key)?.markAsTouched();
    });
  }

  private _resetForm(): void {
    this._selectedImageFile = null;
    this.error.set(null);
  }

  public cancelEdit(): void {
    if (this._originalImageUrl) {
      this.profileImage.set(this._originalImageUrl);
    }

    const currentUser = this._authService.currentUser();
    if (currentUser) {
      this._initializeForm(currentUser);
    }

    this._resetForm();
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
