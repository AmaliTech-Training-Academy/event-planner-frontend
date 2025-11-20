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
  private _isFormInitialized = false;

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
    console.log('=== Constructor started ===');

    this.profileForm = this._fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      emailAddress: ['', [Validators.required, Validators.email]],
      phoneCode: [this._defaultCountryCode],
      phone: ['', [this._phoneNumberValidator.bind(this)]],
      address: [''],
    });

    console.log('Form created with initial values:', this.profileForm.value);

    this.profileForm.get('phoneCode')?.valueChanges.subscribe(() => {
      this.profileForm.get('phone')?.updateValueAndValidity();
    });

    // Auto-populate form whenever user data changes
    effect(
      () => {
        console.log('=== Effect triggered ===');
        const user = this._authService.currentUser();
        console.log('Effect - Current user:', user);
        console.log('Effect - Has ID?', !!user?.id);
        console.log('Effect - Has email?', !!user?.email);

        if (user && user.id) {
          console.log('Effect - Valid user found (has ID), initializing form');
          // Initialize if we have a user with an ID (email is optional for admin)
          this._initializeForm(user);
          this._initializeProfileImage();
        } else {
          console.log('Effect - No valid user data, skipping initialization');
        }
        console.log('=== Effect completed ===');
      },
      { allowSignalWrites: true }
    );

    console.log('=== Constructor completed ===');
  }

  public ngOnInit(): void {
    console.log('=== ngOnInit started ===');

    this._layoutService.pageTitle.set('Edit Profile');
    this._layoutService.logoSrc.set('icons/user-icon-orange.png');
    this._layoutService.logoAlt.set('Edit Profile Icon');

    // Get current user and initialize form
    const currentUser = this._authService.currentUser();
    console.log('1. Current user from authService:', currentUser);
    console.log('2. Has ID?', !!currentUser?.id);
    console.log('3. Has email?', !!currentUser?.email);
    console.log('4. Full user object:', JSON.stringify(currentUser, null, 2));

    if (currentUser?.id) {
      this._currentUserId = currentUser.id.toString();
      console.log('5. User ID set to:', this._currentUserId);

      // Initialize form with current user data immediately
      if (currentUser.email) {
        console.log('6. Calling _initializeForm with user data');
        this._initializeForm(currentUser);
        this._initializeProfileImage();
      } else {
        console.warn(
          '6. User has ID but no email - skipping form initialization'
        );
      }

      // Then fetch fresh data from the server
      console.log('7. Fetching fresh user data from server...');
      this._authService.checkAuthUser(this._currentUserId).subscribe({
        next: (response) => {
          console.log('8. User data refreshed from server:', response);
          console.log(
            '9. Updated currentUser:',
            this._authService.currentUser()
          );
        },
        error: (err) => {
          console.error('8. Failed to fetch user data:', err);
        },
      });
    } else {
      console.warn(
        '5. No current user found in ngOnInit - cannot initialize form'
      );
      console.log('6. Checking localStorage for auth data...');
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName');
      const userEmail = localStorage.getItem('userEmail');
      console.log('7. LocalStorage data:', { userId, userName, userEmail });
    }

    console.log('=== ngOnInit completed ===');
  }

  /** Initialize form with current user data */
  private _initializeForm(
    user: OtpBodyData & { phone?: string; address?: string }
  ): void {
    console.log('=== _initializeForm started ===');
    console.log('10. User data received:', user);
    console.log('11. User fullName:', user.fullName);
    console.log('12. User email:', user.email);
    console.log('13. User phone:', user.phone);
    console.log('14. User address:', user.address);

    const formData: any = {
      fullName: user.fullName || '',
      emailAddress: user.email || '',
      phoneCode: this._defaultCountryCode,
      phone: '',
      address: '',
    };

    console.log('15. Initial form data created:', formData);

    // Parse and populate phone number
    if (user.phone) {
      console.log('16. Phone number exists, attempting to parse:', user.phone);
      try {
        const parsed = parsePhoneNumber(user.phone);
        console.log('17. Parsed phone:', parsed);
        if (parsed) {
          formData.phoneCode = parsed.country || this._defaultCountryCode;
          formData.phone = parsed.nationalNumber.toString();
          this.showPhoneField.set(true);
          console.log(
            '18. Phone parsed successfully - Country:',
            formData.phoneCode,
            'Number:',
            formData.phone
          );
        }
      } catch (error) {
        console.warn('18. Phone parsing failed, using raw number:', error);
        // If parsing fails, use the raw phone number
        formData.phone = user.phone;
        this.showPhoneField.set(true);
      }
    } else {
      console.log('16. No phone number to parse');
      this.showPhoneField.set(false);
    }

    // Populate address
    if (user.address) {
      console.log('19. Address exists:', user.address);
      formData.address = user.address;
      this.showAddressField.set(true);
    } else {
      console.log('19. No address to populate');
      this.showAddressField.set(false);
    }

    console.log('20. Final form data to patch:', formData);
    console.log(
      '21. Current form values BEFORE patch:',
      this.profileForm.value
    );

    // Update form with new values
    this.profileForm.patchValue(formData, { emitEvent: false });

    console.log('22. Current form values AFTER patch:', this.profileForm.value);

    // Mark all fields as untouched and pristine to prevent validation errors on load
    Object.keys(this.profileForm.controls).forEach((key) => {
      const control = this.profileForm.get(key);
      control?.markAsUntouched();
      control?.markAsPristine();
    });

    console.log('23. All form controls marked as untouched and pristine');
    console.log('24. Form valid?', this.profileForm.valid);
    console.log('25. Form errors:', this.profileForm.errors);

    this._isFormInitialized = true;
    console.log('=== _initializeForm completed ===');
  }

  private _initializeProfileImage(): void {
    console.log('=== _initializeProfileImage started ===');
    const imageUrl = this.currentProfileImage();
    console.log('26. Profile image URL:', imageUrl);
    this._originalImageUrl = imageUrl;
    this.profileImage.set(imageUrl);
    console.log('27. Profile image signal set');
    console.log('=== _initializeProfileImage completed ===');
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
      if (e.target?.result) this.profileImage.set(e.target.result as string);
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

    if (field.hasError('required')) return `${fieldLabel} is required`;
    if (field.hasError('email')) return 'Please enter a valid email address';
    if (field.hasError('minlength'))
      return `${fieldLabel} must be at least ${
        field.getError('minlength').requiredLength
      } characters`;
    if (field.hasError('invalidPhone')) return field.getError('invalidPhone');

    return '';
  }

  protected getFormattedPhoneNumber(): string {
    const phone = this.profileForm.get('phone')?.value;
    const country = this.profileForm.get('phoneCode')?.value as CountryCode;
    if (!phone || !country) return '';
    try {
      const parsed = parsePhoneNumber(phone, country);
      return parsed && parsed.isValid() ? parsed.formatInternational() : phone;
    } catch {
      return phone;
    }
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
            this.error.set(
              err?.error?.message ||
                err?.message ||
                'Failed to update profile. Please try again.'
            );
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
        const parsed = parsePhoneNumber(phoneNumber, countryCode);
        if (parsed?.isValid()) formattedPhone = parsed.number;
      } catch {}
    }

    const currentUser = this._authService.currentUser();
    if (!currentUser) throw new Error('No user data available');

    const userUpdateRequest = {
      fullName: this.profileForm.value.fullName,
      email: this.profileForm.value.emailAddress,
      phone: formattedPhone,
      address: this.profileForm.value.address || '',
      status: true,
    };

    const formData = new FormData();
    formData.append('userUpdateRequest', JSON.stringify(userUpdateRequest));
    if (this._selectedImageFile)
      formData.append('profilePicture', this._selectedImageFile);

    return formData;
  }

  private _markFormAsTouched(): void {
    Object.keys(this.profileForm.controls).forEach((key) =>
      this.profileForm.get(key)?.markAsTouched()
    );
  }

  private _resetForm(): void {
    this._selectedImageFile = null;
    this.error.set(null);
    this.profileForm.markAsPristine();
  }

  public cancelEdit(): void {
    // Restore original image
    if (this._originalImageUrl) {
      this.profileImage.set(this._originalImageUrl);
    }

    // Reset to current user data
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
    if (!countryCode) return { invalidPhone: 'Country code is required' };

    try {
      const parsed = parsePhoneNumber(phoneNumber, countryCode);
      if (!parsed || !parsed.isValid())
        return {
          invalidPhone: 'Phone number is not valid for the selected country',
        };
      return null;
    } catch {
      return { invalidPhone: 'Invalid phone number format' };
    }
  }
}
