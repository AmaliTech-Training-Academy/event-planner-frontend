import {
  Component,
  signal,
  OnInit,
  inject,
  Signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LayoutService } from '@core/services/layout.service';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { InputComponent } from '@shared/ui/input/input.component';

interface ProfileData {
  fullName: string;
  emailAddress: string;
  avatar: string;
}

interface ProfileForm {
  fullName: FormControl<string>;
  emailAddress: FormControl<string>;
}

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
})
export class EditProfileComponent implements OnInit {
  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _layoutService: LayoutService = inject(LayoutService);

  private readonly _profileData: WritableSignal<ProfileData> =
    signal<ProfileData>({
      fullName: 'Andrew',
      emailAddress: 'user@eventhub.com',
      avatar: 'https://i.pravatar.cc/150?img=33',
    });

  private readonly _hasAttemptedSubmit: WritableSignal<boolean> =
    signal<boolean>(false);
  private readonly _isSubmitting: WritableSignal<boolean> =
    signal<boolean>(false);

  public readonly profileData: Signal<ProfileData> =
    this._profileData.asReadonly();
  public readonly hasAttemptedSubmit: Signal<boolean> =
    this._hasAttemptedSubmit.asReadonly();
  public readonly isSubmitting: Signal<boolean> =
    this._isSubmitting.asReadonly();

  public readonly profileForm: FormGroup<ProfileForm>;

  constructor() {
    this.profileForm = this._createProfileForm();
  }

  public ngOnInit(): void {
    this._layoutService.pageTitle.set('Audit Logs');
    this._layoutService.logoSrc.set('icons/audit-logs.png');
    this._layoutService.logoAlt.set('Audit Logs Icon');

    this._loadProfileData();
  }

  public saveProfile(): void {
    this._hasAttemptedSubmit.set(true);
    this.profileForm.markAllAsTouched();

    if (this.profileForm.invalid || this._isSubmitting()) {
      return;
    }

    this._isSubmitting.set(true);

    const updatedProfile: ProfileData = {
      ...this._profileData(),
      fullName: this.profileForm.value.fullName ?? '',
      emailAddress: this.profileForm.value.emailAddress ?? '',
    };

    console.log('Saving profile:', updatedProfile);

    setTimeout(() => {
      this._profileData.set(updatedProfile);
      this._isSubmitting.set(false);
      this._hasAttemptedSubmit.set(false);
      console.log('Profile saved successfully!');
    }, 1000);
  }

  public hasFieldError(fieldName: keyof ProfileForm): boolean {
    const field: FormControl | null = this.profileForm.get(
      fieldName
    ) as FormControl | null;
    return !!(field?.invalid && (field?.touched || this._hasAttemptedSubmit()));
  }

  public getFieldErrorMessage(fieldName: keyof ProfileForm): string {
    const field: FormControl | null = this.profileForm.get(
      fieldName
    ) as FormControl | null;

    if (!field?.errors) {
      return '';
    }

    const errors = field.errors;

    if (errors['required']) {
      return `${this._formatFieldName(fieldName)} is required`;
    }

    if (errors['email']) {
      return 'Please enter a valid email address';
    }

    return 'Invalid input';
  }

  public changeAvatar(): void {
    console.log('Opening avatar upload dialog');
  }

  public cancelEdit(): void {
    this.profileForm.reset({
      fullName: this._profileData().fullName,
      emailAddress: this._profileData().emailAddress,
    });
    this._hasAttemptedSubmit.set(false);
    console.log('Edit cancelled');
  }

  private _createProfileForm(): FormGroup<ProfileForm> {
    return this._fb.group({
      fullName: this._fb.control(this._profileData().fullName, [
        Validators.required,
      ]),
      emailAddress: this._fb.control(this._profileData().emailAddress, [
        Validators.required,
        Validators.email,
      ]),
    }) as unknown as FormGroup<ProfileForm>;
  }

  private _loadProfileData(): void {
    this.profileForm.patchValue({
      fullName: this._profileData().fullName,
      emailAddress: this._profileData().emailAddress,
    });
  }

  private _formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str: string) => str.toUpperCase())
      .trim();
  }
}
