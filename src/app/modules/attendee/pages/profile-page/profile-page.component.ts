import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  private readonly router = inject(Router);
  protected readonly routes = APP_ROUTES;
  protected fullName = signal('Andrew');
  protected email = signal('user@eventhub.com');
  protected phone = signal('+233 345 6785 423');
  protected address = signal('123 Main Street, City, State, 12345');
  protected isBasicInfoDisabled = signal(true);
  protected isContactInfoDisabled = signal(true);
  protected basicInfoButtonText = computed(() =>
    this.isBasicInfoDisabled() ? 'Edit' : 'Save'
  );
  protected contactInfoButtonText = computed(() =>
    this.isContactInfoDisabled() ? 'Edit' : 'Save'
  );

  public ngOnInit(): void {
  }

 
  protected onEditBasicInfo(): void {
    if (!this.isBasicInfoDisabled()) {
    
    }
   
    this.isBasicInfoDisabled.update((v) => !v);
  }

  protected onEditContactInfo(): void {
    if (!this.isContactInfoDisabled()) {
    }
   
    this.isContactInfoDisabled.update((v) => !v);
  }

  protected onLogout(): void {
   
    this.router.navigate([this.routes.LOGIN]);
  }
}