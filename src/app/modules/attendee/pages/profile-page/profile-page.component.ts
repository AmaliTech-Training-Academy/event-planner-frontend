import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { AuthService } from '@app/core/services/auth.service';

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

  // Form group getters
  protected get basicInfoGroup() {
    return this.profileForm.get('basicInfo');
  }
  protected get contactInfoGroup() {
    return this.profileForm.get('contactInfo');
  }

  public ngOnInit(): void {
    const currentUser = this.authService.currentUser();

    this.profileForm = this.fb.group({
      basicInfo: this.fb.group({
        fullName: [currentUser?.fullName, [Validators.required]],
        email: [currentUser?.email, [Validators.email, Validators.required]],
      }),
      contactInfo: this.fb.group({
        phone: ['', [Validators.required]],
        address: ['', [Validators.required]],
      }),
    });

    this.disableBasicInfo();
    this.disableContactInfo();
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
      console.log('Saving Basic Info:', basicInfo);

      // TODO: Call API to save basic info

      this.disableBasicInfo();
    }
  }

  private saveContactInfo(): void {
    if (this.contactInfoGroup?.valid) {
      const contactInfo = this.contactInfoGroup?.value;
      console.log('Saving Contact Info:', contactInfo);

      // TODO: Call API to save contact info

      this.disableContactInfo();
    }
  }

  protected onLogout(): void {
    this.isLoggingOut.set(true);

    this.authService.logout().subscribe({
      next: () => this.router.navigate([this.routes.LOGIN]),
      error: () => this.isLoggingOut.set(false)
    });
  }

  protected onUploadAvatar(): void {
    // TODO: Implement file upload dialog
  }

  private uploadAvatarToAPI(file: File): void {
    // TODO: Implement avatar upload
  }
}
