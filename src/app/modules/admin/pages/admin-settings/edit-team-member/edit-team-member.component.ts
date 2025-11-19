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

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { parsePhoneNumber, CountryCode } from 'libphonenumber-js';
import { finalize } from 'rxjs';

import { ModalHeaderComponent } from '@shared/ui/modal-header/modal-header.component';
import { InputComponent } from '@shared/ui/input/input.component';
import { ButtonComponent } from '@shared/ui/button/button.component';

import { User } from '@core/models';
import { UserManagementService } from '@core/services/user-management.service';

@Component({
  selector: 'app-edit-team-member',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalHeaderComponent,
    InputComponent,
    ButtonComponent,
    NgOptimizedImage,
  ],
  templateUrl: './edit-team-member.component.html',
  styleUrl: './edit-team-member.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTeamMemberComponent {
  // -----------------------------
  // Inputs / Outputs
  // -----------------------------
  @Output() public readonly close = new EventEmitter<void>();
  @Output() public readonly save = new EventEmitter<User>();

  public readonly userData = input<User | null>();

  // -----------------------------
  // Form + State
  // -----------------------------
  protected readonly profileForm: FormGroup;
  protected readonly profileImage = signal<string>('images/profile-image.png');
  protected readonly saving = signal<boolean>(false);
  protected readonly uploadingImage = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  private readonly _defaultCountryCode: CountryCode = 'GH';
  private readonly _maxImageSize = 5 * 1024 * 1024;
  private _selectedImageFile: File | null = null;
  private _originalImageUrl: string | null = null;

  @ViewChild('fileInput')
  private _fileInput!: ElementRef<HTMLInputElement>;

  // -----------------------------
  // Smart computed: fallback avatar
  // -----------------------------
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

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _userService: UserManagementService
  ) {
    this.profileForm = this._fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneCode: [this._defaultCountryCode],
      phone: [''],
      address: [''],
    });

    // Re-initialize whenever input user changes
    effect(() => {
      const user = this.userData();
      if (user) {
        this._initializeForm();
        this._initializeProfileImage();
      }
    });
  }

  // -------------------------------------------------
  // Initialize form using provided user
  // -------------------------------------------------
  private _initializeForm(): void {
    const user = this.userData();
    if (!user) return;

    let parsedPhone = {
      code: this._defaultCountryCode,
      number: user.phone || '',
    };

    try {
      const parsed = parsePhoneNumber(user.phone || '');
      if (parsed) {
        parsedPhone = {
          code: parsed.country || this._defaultCountryCode,
          number: parsed.nationalNumber.toString(),
        };
      }
    } catch {}

    this.profileForm.patchValue(
      {
        fullName: user.fullName || user.name || '',
        email: user.email,
        phoneCode: parsedPhone.code,
        phone: parsedPhone.number,
        address: user.address || '',
      },
      { emitEvent: false }
    );
  }

  private _initializeProfileImage(): void {
    const url = this.currentProfileImage();
    this._originalImageUrl = url;
    this.profileImage.set(url);
  }

  // -------------------------------------------------
  // Image Upload
  // -------------------------------------------------
  protected triggerFileInput(): void {
    this._fileInput.nativeElement.click();
  }

  protected onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;
    if (!this._validateImage(file)) return;

    this._selectedImageFile = file;
    this.error.set(null);

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        this.profileImage.set(reader.result as string);
      }
    };

    reader.readAsDataURL(file);
  }
  protected getErrorMessage(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return `${this._fieldLabels[fieldName] || fieldName} is required`;
    }

    if (field.hasError('email')) {
      return 'Please enter a valid email address';
    }

    if (field.hasError('minlength')) {
      const minLength = field.getError('minlength').requiredLength;
      return `${
        this._fieldLabels[fieldName] || fieldName
      } must be at least ${minLength} characters`;
    }

    if (field.hasError('invalidPhone')) {
      return field.getError('invalidPhone');
    }

    return '';
  }
  private readonly _fieldLabels: Record<string, string> = {
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone Number',
    address: 'Address',
  };

  private _validateImage(file: File): boolean {
    if (!file.type.startsWith('image/')) {
      this.error.set('Please select a valid image file.');
      return false;
    }

    if (file.size > this._maxImageSize) {
      this.error.set('Image size must be less than 5MB.');
      return false;
    }

    return true;
  }

  // -------------------------------------------------
  // Submit
  // -------------------------------------------------
  protected onSubmit(): void {
    const user = this.userData();
    if (!this.profileForm.valid || !user) {
      this._markFormTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    const formData = this._buildFormData();

    this._userService
      .updateUserWithFormData(String(user.userId), formData)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          const updatedUser = response.data || response;
          this.save.emit(updatedUser);
          this.close.emit();
        },
        error: (err) => {
          const message =
            err?.error?.message ||
            err?.message ||
            'Failed to update profile. Please try again.';
          this.error.set(message);
        },
      });
  }

  private _buildFormData(): FormData {
    const form = this.profileForm.value;

    let formattedPhone = form.phone;

    try {
      const parsed = parsePhoneNumber(
        form.phone,
        form.phoneCode as CountryCode
      );
      if (parsed?.isValid()) {
        formattedPhone = parsed.number;
      }
    } catch {}

    const updatePayload = {
      fullName: form.fullName,
      email: form.email,
      phone: formattedPhone,
      address: form.address || '',
    };

    const fd = new FormData();
    fd.append('userUpdateRequest', JSON.stringify(updatePayload));

    if (this._selectedImageFile) {
      fd.append('profilePicture', this._selectedImageFile);
    }

    return fd;
  }

  private _markFormTouched(): void {
    Object.values(this.profileForm.controls).forEach((c) => c.markAsTouched());
  }

  // -------------------------------------------------
  // Cancel
  // -------------------------------------------------
  protected onCancel(): void {
    if (this._originalImageUrl) {
      this.profileImage.set(this._originalImageUrl);
    }
    this.close.emit();
  }
}
