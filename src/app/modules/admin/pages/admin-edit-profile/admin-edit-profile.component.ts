import {
  Component,
  signal,
  OnInit,
  ViewChild,
  ElementRef,
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
import { finalize, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { LayoutService } from '../../../../core/services/layout.service';
import { AuthService } from '../../../../core/services/auth.service';
import { UserManagementService } from '../../../../core/services/user-management.service';
import { PlatformSettingsService } from '../../../../core/services/platform-settings-management.service';
import { OtpBodyData } from '../../../../core/models/auth-response.model';
import { TeamMember } from '../../../../core/models/platform-settings.model';

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
  protected readonly isEditingTeamMember = signal<boolean>(false);

  protected readonly statusIcon: string = 'icons/camera.png';

  private readonly _defaultCountryCode: CountryCode = 'GH';
  private readonly _maxImageSize: number = 5 * 1024 * 1024;
  private _selectedImageFile: File | null = null;
  private _originalImageUrl: string | null = null;
  private _currentUserId: string | null = null;
  private _editingMember: TeamMember | null = null;

  protected readonly currentProfileImage = computed(() => {
    if (this.isEditingTeamMember() && this._editingMember) {
      const name = this._editingMember.fullName || 'Team Member';
      return (
        this._editingMember.profilePicture ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}&background=FF6B35&color=fff&size=128`
      );
    }

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
    private readonly _userManagementService: UserManagementService,
    private readonly _platformSettingsService: PlatformSettingsService,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router
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
  }

  ngOnInit(): void {
    this._layoutService.pageTitle.set('Edit Profile');
    this._layoutService.logoSrc.set('icons/user-icon-orange.png');
    this._layoutService.logoAlt.set('Edit Profile Icon');

    this._route.params.subscribe((params) => {
      const userId = params['userId'];
      if (userId) {
        this.isEditingTeamMember.set(true);
        this._loadTeamMemberData(userId);
      } else {
        this.isEditingTeamMember.set(false);
        const currentUser = this._authService.currentUser();
        if (currentUser?.id) {
          this._currentUserId = currentUser.id.toString();
          this._authService.checkAuthUser(this._currentUserId).subscribe();
        } else {
          const user = this._authService.currentUser();
          if (user) {
            this._initializeForm(user);
            this._initializeProfileImage();
          }
        }
      }
    });
  }

  private _loadTeamMemberData(userId: string): void {
    this._platformSettingsService.teamMembers$
      .pipe(take(1))
      .subscribe((members: TeamMember[]) => {
        const member = members.find((m) => m.id.toString() === userId);

        if (member) {
          this._editingMember = member;
          this._currentUserId = member.id.toString();

          const userData: OtpBodyData = {
            id: member.id,
            email: member.email,
            fullName: member.fullName,
            profilePicture: member.profilePicture,
            role: member.role,
          };

          this._initializeForm(userData);
          this._initializeProfileImage();
        } else {
          this._platformSettingsService.loadTeamMembers().subscribe({
            next: (response) => {
              if (response?.data) {
                const foundMember = response.data.find(
                  (m) => m.id.toString() === userId
                );
                if (foundMember) {
                  this._editingMember = foundMember;
                  this._currentUserId = foundMember.id.toString();

                  const userData: OtpBodyData = {
                    id: foundMember.id,
                    email: foundMember.email,
                    fullName: foundMember.fullName,
                    profilePicture: foundMember.profilePicture,
                    role: foundMember.role,
                  };

                  this._initializeForm(userData);
                  this._initializeProfileImage();
                } else {
                  this.error.set('Team member not found');
                  this._router.navigate(['/admin/settings']);
                }
              }
            },
            error: (err) => {
              this.error.set('Failed to load team member data');
              this._router.navigate(['/admin/settings']);
            },
          });
        }
      });
  }

  private _initializeForm(user: OtpBodyData): void {
    const formData: any = {
      fullName: user.fullName || '',
      emailAddress: user.email || '',
      phoneCode: this._defaultCountryCode,
      phone: '',
      address: '',
    };

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
    } catch { }

    return phoneNumber;
  }

  protected saveProfile(): void {
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

          if (!this.isEditingTeamMember()) {
            const authData: OtpBodyData = {
              id: updatedUser.userId || parseInt(this._currentUserId!, 10),
              email: updatedUser.email,
              fullName: updatedUser.fullName,
              profilePicture: updatedUser.profileImageUrl as string,
              role: updatedUser.role,
            };

            this._authService['_userInfo$'].next(authData);

            const context =
              this._authService.getCurrentAuthContext() ||
              (authData.role === 'admin' ? 'admin' : 'user');

            this._authService['saveAuthToStorage'](
              authData.id.toString(),
              authData.fullName,
              authData.profilePicture,
              authData.email,
              authData.role,
              context
            );
          } else {
            this._platformSettingsService.loadTeamMembers().subscribe();
          }

          this._resetForm();
          this.error.set(null);

          if (this.isEditingTeamMember()) {
            setTimeout(() => {
              this._router.navigate(['/admin/settings']);
            }, 500);
          }
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
      } catch { }
    }

    let userRole = 'admin';
    if (this.isEditingTeamMember() && this._editingMember) {
      userRole = this._editingMember.role;
    } else {
      const currentUser = this._authService.currentUser();
      if (currentUser) {
        userRole = currentUser.role;
      }
    }

    const userUpdateRequest = {
      fullName: this.profileForm.value.fullName,
      email: this.profileForm.value.emailAddress,
      phone: formattedPhone,
      address: this.profileForm.value.address || '',
      status: true,
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

  protected cancelEdit(): void {
    if (this._originalImageUrl) {
      this.profileImage.set(this._originalImageUrl);
    }

    if (this.isEditingTeamMember() && this._editingMember) {
      const userData: OtpBodyData = {
        id: this._editingMember.id,
        email: this._editingMember.email,
        fullName: this._editingMember.fullName,
        profilePicture: this._editingMember.profilePicture,
        role: this._editingMember.role,
      };
      this._initializeForm(userData);
    } else {
      const currentUser = this._authService.currentUser();
      if (currentUser) {
        this._initializeForm(currentUser);
      }
    }

    this._resetForm();

    if (this.isEditingTeamMember()) {
      this._router.navigate(['/admin/settings']);
    }
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
