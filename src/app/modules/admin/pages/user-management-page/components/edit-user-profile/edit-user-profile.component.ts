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
import { finalize } from 'rxjs';
import { ModalHeaderComponent } from '../../../../../../shared/ui/modal-header/modal-header.component';
import { InputComponent } from '../../../../../../shared/ui/input/input.component';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { UserManagementService } from '../../../../../../core/services/user-management.service';
import { User } from '../../../../../../core/models/user.model';

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
  @Output() public readonly save = new EventEmitter<User>();
  @Input() public userData?: User;

  @ViewChild('fileInput') private _fileInput!: ElementRef<HTMLInputElement>;

  protected readonly profileForm: FormGroup;
  protected readonly profileImage = signal<string>(
    'https://ui-avatars.com/api/?name=User&background=FF6B35&color=fff&size=128'
  );
  protected readonly saving = signal<boolean>(false);
  protected readonly uploadingImage = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  protected readonly statusIcon = 'icons/camera.png';

  private readonly _defaultCountryCode: CountryCode = 'GH';
  private readonly _maxImageSize = 5 * 1024 * 1024;
  private _selectedImageFile: File | null = null;
  private _uploadedImageUrl: string | null = null;

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
  }

  public ngOnInit(): void {
    if (this.userData) {
      this._initializeForm();
      this._initializeProfileImage();
    }
  }

  private _initializeForm(): void {
    if (!this.userData) return;

    // Parse phone number if it exists
    if (this.userData.phone) {
      try {
        const parsed = parsePhoneNumber(this.userData.phone);
        if (parsed) {
          this.profileForm.patchValue({
            fullName: this.userData.fullName,
            email: this.userData.email,
            phoneCode: parsed.country || this._defaultCountryCode,
            phone: parsed.nationalNumber,
            address: this.userData.address || '',
          });
          return;
        }
      } catch {
        // Fall through to default handling
      }
    }

    // Default form initialization
    this.profileForm.patchValue({
      fullName: this.userData.fullName,
      email: this.userData.email,
      phoneCode: this._defaultCountryCode,
      phone: this.userData.phone || '',
      address: this.userData.address || '',
    });
  }

  private _initializeProfileImage(): void {
    if (!this.userData) return;

    if (this.userData.profileImageUrl) {
      this.profileImage.set(this.userData.profileImageUrl);
    } else if (this.userData.avatar) {
      this.profileImage.set(this.userData.avatar);
    } else {
      // Generate avatar from name
      const name = this.userData.fullName || this.userData.name || 'User';
      this.profileImage.set(
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}&background=FF6B35&color=fff&size=128`
      );
    }
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

    // Show preview immediately
    this._showImagePreview(file);

    // Upload image to get URL (if your API supports it)
    if (this.userData?.userId) {
      this._uploadProfileImage();
    }
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

  private _showImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        this.profileImage.set(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }

  private _uploadProfileImage(): void {
    if (!this._selectedImageFile || !this.userData?.userId) return;

    this.uploadingImage.set(true);
    this.error.set(null);

    // Check if uploadProfileImage method exists
    if (typeof this.userManagementService.uploadProfileImage === 'function') {
      this.userManagementService
        .uploadProfileImage(
          String(this.userData.userId),
          this._selectedImageFile
        )
        .pipe(finalize(() => this.uploadingImage.set(false)))
        .subscribe({
          next: (response) => {
            this._uploadedImageUrl =
              response.data.profileImageUrl || response.data.imageUrl || null;
            console.log('Image uploaded successfully:', this._uploadedImageUrl);
          },
          error: (err) => {
            this.error.set('Failed to upload image. Will include as base64.');
            console.warn('Image upload not supported or failed:', err);
            this.uploadingImage.set(false);
          },
        });
    } else {
      // If upload endpoint doesn't exist, we'll send base64 with the user update
      this.uploadingImage.set(false);
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
    } catch {
      // Return original if parsing fails
    }

    return phoneNumber;
  }

  protected onSubmit(): void {
    if (!this.profileForm.valid || !this.userData?.userId) {
      this._markFormAsTouched();
      return;
    }

    // Prevent duplicate submissions
    if (this.saving()) return;

    this.saving.set(true);
    this.error.set(null);

    const updatePayload = this._buildUpdatePayload();

    // Call backend to update user
    this.userManagementService
      .updateUser(String(this.userData.userId), updatePayload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          console.log('User updated successfully:', response.data);
          this.save.emit(response.data);
          this.close.emit();
        },
        error: (err) => {
          const errorMessage =
            err?.error?.message || err?.message || 'Failed to update profile';
          this.error.set(errorMessage);
          console.error('Update failed:', err);
        },
      });
  }

  private _buildUpdatePayload(): Partial<User> {
    const phoneNumber = this.profileForm.get('phone')?.value;
    const countryCode = this.profileForm.get('phoneCode')?.value as CountryCode;
    let formattedPhone = phoneNumber;

    // Format phone number if provided
    if (phoneNumber && countryCode) {
      try {
        const phoneNumberObj = parsePhoneNumber(phoneNumber, countryCode);
        if (phoneNumberObj && phoneNumberObj.isValid()) {
          formattedPhone = phoneNumberObj.number;
        }
      } catch {
        // Use original phone number
      }
    }

    const payload: Partial<User> = {
      fullName: this.profileForm.value.fullName,
      email: this.profileForm.value.email,
      phone: formattedPhone || undefined,
      address: this.profileForm.value.address || undefined,
    };

    // Include uploaded image URL if available
    if (this._uploadedImageUrl) {
      payload.profileImageUrl = this._uploadedImageUrl;
    } else if (this._selectedImageFile && this.profileImage()) {
      // If no upload endpoint, send base64 (only if your API supports it)
      payload.profileImageUrl = this.profileImage();
    }

    return payload;
  }

  private _markFormAsTouched(): void {
    Object.keys(this.profileForm.controls).forEach((key) => {
      this.profileForm.get(key)?.markAsTouched();
    });
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
