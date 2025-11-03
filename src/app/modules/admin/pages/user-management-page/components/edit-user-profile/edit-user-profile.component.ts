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
export class EditUserProfileComponent {
@Output() public close: EventEmitter<void> = new EventEmitter<void>();
@Output() public save: EventEmitter<any> = new EventEmitter<any>();
@Input() public userData?: any;

@ViewChild('fileInput') private _fileInput!: ElementRef<HTMLInputElement>;

public profileForm: FormGroup;
public profileImage = signal<string>(
'[https://ui-avatars.com/api/?name=User&background=FF6B35&color=fff&size=128](https://ui-avatars.com/api/?name=User&background=FF6B35&color=fff&size=128)'
);
public defaultCountryCode: CountryCode = 'GH';

public phoneCodes = [
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

constructor(private _fb: FormBuilder) {
this.profileForm = this._fb.group({
fullName: ['', [Validators.required, Validators.minLength(2)]],
email: ['', [Validators.required, Validators.email]],
phoneCode: ['GH'],
phoneNumber: ['', [this._phoneNumberValidator.bind(this)]],
address: [''],
});

this.profileForm.get('phoneCode')?.valueChanges.subscribe(() => {
  this.profileForm.get('phoneNumber')?.updateValueAndValidity();
});

}

ngOnInit(): void {
if (this.userData) {
this.profileForm.patchValue(this.userData);
if (this.userData.profileImage) {
this.profileImage.set(this.userData.profileImage);
}
}
}

private _phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
const phoneNumber = control.value;
if (!phoneNumber) return null;

const countryCode = this.profileForm?.get('phoneCode')?.value as CountryCode;
if (!countryCode) return { invalidPhone: 'Country code is required' };

try {
  const phoneNumberObj = parsePhoneNumber(phoneNumber, countryCode);
  if (!phoneNumberObj || !phoneNumberObj.isValid()) {
    return { invalidPhone: 'Phone number is not valid for the selected country' };
  }
  return null;
} catch {
  return { invalidPhone: 'Invalid phone number format' };
}

}

public triggerFileInput(): void {
this._fileInput.nativeElement.click();
}

public onImageSelect(event: Event): void {
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
if (e.target?.result) this.profileImage.set(e.target.result as string);
};
reader.readAsDataURL(file);
}
}

public hasError(fieldName: string): boolean {
const field = this.profileForm.get(fieldName);
return !!(field && field.invalid && (field.dirty || field.touched));
}

public getErrorMessage(fieldName: string): string {
const field = this.profileForm.get(fieldName);
if (!field) return '';

if (field.hasError('required')) return `${this._getFieldLabel(fieldName)} is required`;
if (field.hasError('email')) return 'Please enter a valid email address';
if (field.hasError('minlength')) {
  const minLength = field.getError('minlength').requiredLength;
  return `${this._getFieldLabel(fieldName)} must be at least ${minLength} characters`;
}
if (field.hasError('invalidPhone')) return field.getError('invalidPhone');

return '';

}

private _getFieldLabel(fieldName: string): string {
const labels: { [key: string]: string } = {
fullName: 'Full Name',
email: 'Email',
phoneNumber: 'Phone Number',
};
return labels[fieldName] || fieldName;
}

public getFormattedPhoneNumber(): string {
const phoneNumber = this.profileForm.get('phoneNumber')?.value;
const countryCode = this.profileForm.get('phoneCode')?.value as CountryCode;

if (!phoneNumber || !countryCode) return '';

try {
  const phoneNumberObj = parsePhoneNumber(phoneNumber, countryCode);
  if (phoneNumberObj && phoneNumberObj.isValid()) return phoneNumberObj.formatInternational();
} catch {
  // Return original
}
return phoneNumber;

}

public onSubmit(): void {
if (this.profileForm.valid) {
const phoneNumber = this.profileForm.get('phoneNumber')?.value;
const countryCode = this.profileForm.get('phoneCode')?.value as CountryCode;
let formattedPhone = phoneNumber;

  if (phoneNumber && countryCode) {
    try {
      const phoneNumberObj = parsePhoneNumber(phoneNumber, countryCode);
      if (phoneNumberObj && phoneNumberObj.isValid()) formattedPhone = phoneNumberObj.number;
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

public onCancel(): void {
this.close.emit();
}
}
