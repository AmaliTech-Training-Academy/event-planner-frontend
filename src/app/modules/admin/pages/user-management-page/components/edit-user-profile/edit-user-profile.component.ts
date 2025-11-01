import {
  Component,
  EventEmitter,
  Output,
  Input,
  signal,
  ViewChild,
  ElementRef,
  OnInit,
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
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalHeaderComponent,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './edit-user-profile.component.html',
  styleUrl: './edit-user-profile.component.scss',
})
export class EditUserProfileComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Input() userData?: any;
  editingSection: 'basic' | 'contact' | null = null;

  // Start editing a section
  startEditing(section: 'basic' | 'contact') {
    this.editingSection = section;
    this.profileForm.enable();
  }
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  profileForm: FormGroup;
  profileImage = signal(
    'https://ui-avatars.com/api/?name=User&background=FF6B35&color=fff&size=128'
  );

  // your phone code list (kept exactly)
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
    });
  }

  ngOnInit() {
    if (this.userData) {
      this.profileForm.patchValue(this.userData);
      if (this.userData.profileImage) {
        this.profileImage.set(this.userData.profileImage);
      }
    }

    // Revalidate phone number when phoneCode changes
    this.profileForm.get('phoneCode')?.valueChanges.subscribe(() => {
      this.profileForm.get('phoneNumber')?.updateValueAndValidity();
    });
  }

  // ✅ fixed phone number validator
  phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
    const phoneNumber = control.value;
    if (!phoneNumber) return null;

    const countryCode = this.profileForm?.get('phoneCode')
      ?.value as CountryCode;
    if (!countryCode) return { invalidPhone: 'Country code required' };

    try {
      const phoneObj = parsePhoneNumber(phoneNumber, countryCode);
      if (!phoneObj.isValid()) {
        return { invalidPhone: 'Invalid phone number for selected country' };
      }
      return null;
    } catch {
      return { invalidPhone: 'Invalid phone number format' };
    }
  }

  // ✅ URL validator (unchanged)
  urlValidator(control: AbstractControl): ValidationErrors | null {
    const url = control.value;
    if (!url) return null;

    const urlPattern =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(url)
      ? null
      : { invalidUrl: 'Please enter a valid URL' };
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  // remove phoneService formatting (not available)
  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.profileForm.get('phoneNumber')?.setValue(input.value, {
      emitEvent: false,
    });
  }

  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
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
    if (field.hasError('minlength')) {
      const minLength = field.getError('minlength')?.requiredLength;
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
    const labels: Record<string, string> = {
      fullName: 'Full Name',
      username: 'Username',
      email: 'Email',
      phoneNumber: 'Phone Number',
      website: 'Website',
    };
    return labels[fieldName] || fieldName;
  }

  @Output() toggleStatus = new EventEmitter<'Active' | 'Inactive'>();

  toggleUserStatus() {
    const newStatus =
      this.userData?.status === 'Active' ? 'Inactive' : 'Active';
    this.toggleStatus.emit(newStatus);
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const countryCode = this.profileForm.get('phoneCode')
        ?.value as CountryCode;
      const phoneNumber = this.profileForm.get('phoneNumber')?.value;
      let formattedPhone = phoneNumber;

      try {
        const phoneObj = parsePhoneNumber(phoneNumber, countryCode);
        if (phoneObj.isValid()) {
          formattedPhone = phoneObj.number; // E.164
        }
      } catch (e) {
        console.warn('Phone format error:', e);
      }

      const formData = {
        ...this.profileForm.value,
        phoneNumber: formattedPhone,
        profileImage: this.profileImage(),
      };
      this.save.emit(formData);
    }
  }
  cancelEditing() {
    this.editingSection = null;
    this.profileForm.patchValue(this.userData);
    this.profileForm.markAsPristine();
    this.profileForm.markAsUntouched();
  }
  saveSectionChanges() {
    if (this.profileForm.valid) {
      const countryCode = this.profileForm.get('phoneCode')
        ?.value as CountryCode;
      const phoneNumber = this.profileForm.get('phoneNumber')?.value;
      let formattedPhone = phoneNumber;

      try {
        const phoneObj = parsePhoneNumber(phoneNumber, countryCode);
        if (phoneObj.isValid()) {
          formattedPhone = phoneObj.number;
        }
      } catch {}

      const formData = {
        ...this.profileForm.value,
        phoneNumber: formattedPhone,
        profileImage: this.profileImage(),
      };

      this.save.emit(formData);
      this.editingSection = null;
    }
  }
  onCancel() {
    this.close.emit();
  }
}
