import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';




@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgOptimizedImage,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  protected readonly routes = APP_ROUTES;
  protected fullName = signal('Andrew');
  protected email = signal('user@eventhub.com');
  protected phone = signal('+233 345 6785 423');
  protected address = signal('123 Main Street, City, State, 12345');
  protected avatarUrl = signal('images/profile.png'); 
  protected isBasicInfoDisabled = signal(true);
  protected isContactInfoDisabled = signal(true);

  protected basicInfoButtonText = computed(() =>
    this.isBasicInfoDisabled() ? 'Edit' : 'Save'
  );
  protected contactInfoButtonText = computed(() =>
    this.isContactInfoDisabled() ? 'Edit' : 'Save'
  );

 
  protected isSavingBasicInfo = signal(false);
  protected isSavingContactInfo = signal(false);
  protected isLoggingOut = signal(false);

  public ngOnInit(): void {
    this.loadUserProfile();
  }

 
  private loadUserProfile(): void {
    // TODO: Implement API call to fetch user profile
  }

  
  protected onEditBasicInfo(): void {
    if (!this.isBasicInfoDisabled()) {
    
      this.saveBasicInfo();
    } else {
    
      this.isBasicInfoDisabled.set(false);
    }
  }

  
  private saveBasicInfo(): void {
    this.isSavingBasicInfo.set(true);

    // TODO: Implement API call to update basic info
    
    setTimeout(() => {
      this.isBasicInfoDisabled.set(true);
      this.isSavingBasicInfo.set(false);
    }, 500);
  }

  
  protected onEditContactInfo(): void {
    if (!this.isContactInfoDisabled()) {
      
      this.saveContactInfo();
    } else {
     
      this.isContactInfoDisabled.set(false);
    }
  }

  private saveContactInfo(): void {
    this.isSavingContactInfo.set(true);

    // TODO: Implement API call to update contact info
    
    setTimeout(() => {
      this.isContactInfoDisabled.set(true);
      this.isSavingContactInfo.set(false);
    }, 500);
  }

 
  protected onLogout(): void {
    this.isLoggingOut.set(true);

    // TODO: Implement proper logout flow with AuthService
    
    

    setTimeout(() => {
      this.isLoggingOut.set(false);
      this.router.navigate([this.routes.LOGIN]);
    }, 300);
  }

  protected onUploadAvatar(): void {
    // TODO: Implement file upload dialog
   }

  
  private uploadAvatarToAPI(file: File): void {
    // TODO: Implement avatar upload
  }
}