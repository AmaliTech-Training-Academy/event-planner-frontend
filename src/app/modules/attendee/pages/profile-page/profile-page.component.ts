import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { AuthService } from '@app/core/services/auth.service';
import { NotificationService } from '@app/core/services/notification.service';
import { OtpBodyData } from '@app/core/models/auth-response.model';
import { UpdateUserPayload } from '@app/core/services/backend/user-backend.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notificationnService = inject(NotificationService)
  private currentUser: OtpBodyData | null = null;
  protected readonly routes = APP_ROUTES;
  protected isLoggingOut = signal(false);
  protected avatarUrl = signal('icons/profile-avata.png');

  protected profileForm!: FormGroup;

  protected isBasicInfoDisabled = signal(true);
  protected isContactInfoDisabled = signal(true);

  protected basicInfoButtonText = computed(() =>
    this.isBasicInfoDisabled() ? 'Edit' : 'Save'
  );

  protected contactInfoButtonText = computed(() =>
    this.isContactInfoDisabled() ? 'Edit' : 'Save'
  );

  protected get basicInfoGroup() {
    return this.profileForm.get('basicInfo');
  }
  protected get contactInfoGroup() {
    return this.profileForm.get('contactInfo');
  }

  public ngOnInit(): void {
    this.currentUser = this.authService.currentUser();

    this.avatarUrl.set(this.currentUser?.profilePicture || 'icons/profile-avata.png');
    
    this.profileForm = this.fb.group({
      avatar: [null],
      basicInfo: this.fb.group({
        fullName: [this.currentUser?.fullName, [Validators.required]],
        email: [this.currentUser?.email, [Validators.email, Validators.required]],
      }),
      contactInfo: this.fb.group({
        phone: [this.currentUser?.phone, [Validators.required]],
        address: [this.currentUser?.address, [Validators.required]],
      }),
    });

    this.disableBasicInfo();
    this.disableContactInfo();
  }

  protected hasError(controlName: string, group: 'basicInfo' | 'contactInfo'): string {
    const control = this.profileForm.get(`${group}.${controlName}`);
    if (!control || !control.touched || !control.invalid) return '';

    if (control.errors?.['required']) return 'This field is required';
    if (control.errors?.['email']) return 'Enter a valid email';

    return '';
  }


  private disableBasicInfo() {
    this.basicInfoGroup?.disable();
    this.isBasicInfoDisabled.set(true);
  }
  private disableContactInfo() {
    this.contactInfoGroup?.disable();
    this.isContactInfoDisabled.set(true);
  }
  private enableBasicInfo() {
    this.basicInfoGroup?.enable();
    this.isBasicInfoDisabled.set(false);
  }
  private enableContactInfo() {
    this.contactInfoGroup?.enable();
    this.isContactInfoDisabled.set(false);
  }

  protected onEditBasicInfo(): void {
    if (this.basicInfoGroup?.disabled) {
      this.enableBasicInfo();
    } else {
      this.saveBasicInfo();
    }
  }

  protected onEditContactInfo(): void {
    if (this.contactInfoGroup?.disabled) {
      this.enableContactInfo();
    } else {
      this.saveContactInfo();
    }
  }

  private saveBasicInfo(): void {
    if (this.basicInfoGroup?.valid) {
      const basicInfo = this.basicInfoGroup?.value;
      this.updateProfile({ fullName: basicInfo?.fullName, email: basicInfo?.email })
      this.disableBasicInfo();
      return
    }
    this.notificationnService.error('Please fill in all required fields.');
  }


  private updateFormValues() {
    const user = this.authService.currentUser();
    if (!user) return;

    this.profileForm.patchValue({
      basicInfo: {
        fullName: user.fullName,
        email: user.email,
      },
      contactInfo: {
        phone: user.phone || '',
        address: user.address || '',
      }
    });
  }

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];


    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      this.notificationnService.error('Image size must not exceed 10 MB');
      input.value = '';
      return;
    }


    const reader = new FileReader();
    reader.onload = () => {
      this.avatarUrl.set(reader.result as string)
    };
    reader.readAsDataURL(file);
    this.profileForm.patchValue({ avatar: file });

    this.updateProfileImage(file);
  }



  private readonly updateProfileImage = (avatar: File) => {
    const data: UpdateUserPayload = { ...this.profileForm.getRawValue().basicInfo, ...this.profileForm.getRawValue().contactInfo, profilePicture: avatar };

    this.authService.updateUser(`${this.currentUser?.id}`, data).subscribe({
      next: () => {
        this.notificationnService.success(`Profile updated successfully`)
        this.updateFormValues()
      },
      error: () => {
        this.updateFormValues()
      }
    })
  }


  private updateProfile(data: UpdateUserPayload) {
    this.authService.updateUser(`${this.currentUser?.id}`, data).subscribe({
      next: () => {
        this.notificationnService.success(`Profile updated successfully`)
        this.updateFormValues()
      },
      error: () => {
        this.updateFormValues()
      }
    })
  }

  private saveContactInfo(): void {
    if (this.contactInfoGroup?.valid) {
      const contactInfo = this.contactInfoGroup?.value;
      const basicInfo = this.basicInfoGroup?.value;
      this.updateProfile({ fullName:basicInfo.fullName ,email:basicInfo.email,  phone: contactInfo?.phone, address: contactInfo?.address })
      this.disableContactInfo();
      return
    }
    this.notificationnService.error('Please fill in all required fields.');
  }

  protected onLogout(): void {
    this.isLoggingOut.set(true);
    this.authService.logout().subscribe({
      next: () => this.notificationnService.success(`Succesfully logged out`),
      error: () => this.isLoggingOut.set(false)
    });
  }
}
