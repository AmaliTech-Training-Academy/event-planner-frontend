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
import { InputComponent } from '../../../../../../shared/ui/input/input.component';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';

@Component({
  selector: 'app-edit-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './edit-user-profile.component.html',
  styleUrl: './edit-user-profile.component.scss',
})
export class EditUserProfileComponent implements OnInit {
  @Input() public userData?: any;
  @Output() public close = new EventEmitter<void>();
  @Output() public save = new EventEmitter<any>();
  @Output() public toggleStatus = new EventEmitter<'Active' | 'Inactive'>();

  @ViewChild('fileInput') private _fileInput!: ElementRef<HTMLInputElement>;

  public profileForm: FormGroup;
  public editingSection: 'basic' | 'contact' | null = null;

  public profileImage = signal(
    'https://ui-avatars.com/api/?name=User&background=FF6B35&color=fff&size=128'
  );

  public readonly phoneCodes = [
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

  constructor(private readonly _fb: FormBuilder) {
    this.profileForm = this._fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneCode: ['GH'],
      phoneNumber: ['', [this._phoneNumberValidator.bind(this)]],
      address: [''],
    });
  }

  public ngOnInit(): void {
    if (this.userData) {
      this.profileForm.patchValue(this.userData);
      if (this.userData?.profileImage) {
        this.profileImage.set(this.userData.profileImage);
      }
    }

    this.profileForm.get('phoneCode')?.valueChanges.subscribe(() => {
      this.profileForm.get('phoneNumber')?.updateValueAndValidity();
    });
  }

  public startEditing(section: 'basic' | 'contact'): void {
    this.editingSection = section;
    this.profileForm.enable();
  }

  public cancelEditing(): void {
    this.editingSection = null;
    if (this.userData) {
      this.profileForm.patchValue(this.userData);
    }
    this.profileForm.markAsPristine();
    this.profileForm.markAsUntouched();
  }

  public saveSectionChanges(): void {
    if (!this.profileForm.valid) return;

    const countryCode = this.profileForm.get('phoneCode')?.value as CountryCode;
    const phoneNumber = this.profileForm.get('phoneNumber')?.value;
    let formattedPhone = phoneNumber;

    try {
      const phoneObj = parsePhoneNumber(phoneNumber, countryCode);
      if (phoneObj?.isValid()) {
        formattedPhone = phoneObj.number;
      }
    } catch {
    }

    const formData = {
      ...this.profileForm.value,
      phoneNumber: formattedPhone,
      profileImage: this.profileImage(),
    };

    this.save.emit(formData);
    this.editingSection = null;
  }

  private _phoneNumberValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const phoneNumber = control.value;
    if (!phoneNumber) return null;

    const countryCode = this.profileForm?.get('phoneCode')
      ?.value as CountryCode;
    if (!countryCode) return { invalidPhone: 'Country code required' };

    try {
      const phoneObj = parsePhoneNumber(phoneNumber, countryCode);
      if (!phoneObj?.isValid()) {
        return { invalidPhone: 'Invalid phone number for selected country' };
      }
      return null;
    } catch {
      return { invalidPhone: 'Invalid phone number format' };
    }
  }

  private _urlValidator(control: AbstractControl): ValidationErrors | null {
    const url = control.value;
    if (!url) return null;

    const urlPattern =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(url)
      ? null
      : { invalidUrl: 'Please enter a valid URL' };
  }

  public triggerFileInput(): void {
    this._fileInput?.nativeElement.click();
  }

  public onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

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
      const result = e.target?.result;
      if (result) {
        this.profileImage.set(result as string);
      }
    };
    reader.readAsDataURL(file);
  }

  public onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input?.value ?? '';
    this.profileForm.get('phoneNumber')?.setValue(value, { emitEvent: false });
  }

  public hasError(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field?.invalid && (field.dirty || field.touched));
  }

  public getErrorMessage(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return `${this._getFieldLabel(fieldName)} is required`;
    }
    if (field.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field.hasError('minlength')) {
      const minLength = field.getError('minlength')?.requiredLength;
      return `${this._getFieldLabel(
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

  private _getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      fullName: 'Full Name',
      username: 'Username',
      email: 'Email',
      phoneNumber: 'Phone Number',
      website: 'Website',
    };
    return labels[fieldName] || fieldName;
  }

  public toggleUserStatus(): void {
    const newStatus =
      this.userData?.status === 'Active' ? 'Inactive' : 'Active';
    this.toggleStatus.emit(newStatus);
  }

  public onSubmit(): void {
    if (!this.profileForm.valid) return;

    const countryCode = this.profileForm.get('phoneCode')?.value as CountryCode;
    const phoneNumber = this.profileForm.get('phoneNumber')?.value;
    let formattedPhone = phoneNumber;

    try {
      const phoneObj = parsePhoneNumber(phoneNumber, countryCode);
      if (phoneObj?.isValid()) {
        formattedPhone = phoneObj.number;
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

  public onCancel(): void {
    this.close.emit();
  }
}
