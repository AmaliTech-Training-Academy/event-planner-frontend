import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LayoutService } from '../../../../core/services/layout.service';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';

// Interfaces
interface SecuritySettings {
  platformName: string;
  platformUrl: string;
  contactEmail: string;
  platformDescription: string;
  maintenanceMode: boolean;
}

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Super Admin' | 'Admin' | 'Manager';
}

type TabType = 'general' | 'notifications' | 'team';

interface SecurityForm {
  platformName: FormControl<string | null>;
  platformUrl: FormControl<string | null>;
  contactEmail: FormControl<string | null>;
  platformDescription: FormControl<string | null>;
  maintenanceMode: FormControl<boolean>;
}

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.scss',
})
export class AdminSettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly layoutService = inject(LayoutService);

  // Active tab state
  protected readonly activeTab = signal<TabType>('general');

  // Security Settings Form
  protected readonly securityForm: FormGroup<SecurityForm>;
  protected readonly hasAttemptedSubmit = signal(false);
  protected readonly isSubmitting = signal(false);

  // Notification Settings
  protected readonly notifications = signal<NotificationSetting[]>([
    {
      id: '1',
      title: 'New Event Creation',
      description: 'Get notified when a new event is created',
      enabled: false,
    },
    {
      id: '2',
      title: 'Payment Failures',
      description: 'Get notified when a payment fails',
      enabled: false,
    },
    {
      id: '3',
      title: 'Platform Errors',
      description: 'Get notified about critical platform errors',
      enabled: false,
    },
  ]);

  // Team Members
  protected readonly teamMembers = signal<TeamMember[]>([
    {
      id: '1',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      avatar: 'icons/user-avatar.png',
      role: 'Super Admin',
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      avatar: 'icons/user-avatar.png',
      role: 'Admin',
    },
  ]);

  constructor() {
    this.securityForm = this.createSecurityForm();
  }

  ngOnInit(): void {
    this.layoutService.pageTitle.set('Admin Settings');
    this.layoutService.logoSrc.set('icons/settings-icon.png');
    this.layoutService.logoAlt.set('Admin Settings Icon');

    // Load initial data
    this.loadSecuritySettings();
  }

  // Tab Navigation
  protected switchTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  // Security Settings Methods
  private createSecurityForm(): FormGroup<SecurityForm> {
    return this.fb.group({
      platformName: this.fb.control('Event Hub', [Validators.required]),
      platformUrl: this.fb.control('https://eventhub.com', [
        Validators.required,
        Validators.pattern(/^https?:\/\/.+/),
      ]),
      contactEmail: this.fb.control('support@eventhub.com', [
        Validators.required,
        Validators.email,
      ]),
      platformDescription: this.fb.control(
        'EventHub is a comprehensive event management platform for organizers and attendees.',
        [Validators.required]
      ),
      maintenanceMode: this.fb.control(false, { nonNullable: true }),
    });
  }

  private loadSecuritySettings(): void {
    // TODO: Load from backend service
    // For now, form already has default values
  }

  protected saveSecuritySettings(): void {
    this.hasAttemptedSubmit.set(true);
    this.securityForm.markAllAsTouched();

    if (this.securityForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const settings: SecuritySettings = {
      platformName: this.securityForm.value.platformName ?? '',
      platformUrl: this.securityForm.value.platformUrl ?? '',
      contactEmail: this.securityForm.value.contactEmail ?? '',
      platformDescription: this.securityForm.value.platformDescription ?? '',
      maintenanceMode: this.securityForm.value.maintenanceMode ?? false,
    };

    console.log('Saving security settings:', settings);

    // TODO: Call backend service
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.hasAttemptedSubmit.set(false);
      console.log('Settings saved successfully!');
    }, 1000);
  }

  protected hasFieldError(fieldName: keyof SecurityForm): boolean {
    const field = this.securityForm.get(fieldName);
    return !!(field?.invalid && (field?.touched || this.hasAttemptedSubmit()));
  }

  protected getFieldErrorMessage(fieldName: keyof SecurityForm): string {
    const field = this.securityForm.get(fieldName);
    if (!field?.errors) return '';

    const errors = field.errors;
    switch (true) {
      case !!errors['required']:
        return `${this.formatFieldName(fieldName)} is required`;
      case !!errors['email']:
        return 'Please enter a valid email address';
      case !!errors['pattern']:
        return 'Please enter a valid URL (starting with http:// or https://)';
      default:
        return 'Invalid input';
    }
  }

  private formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  // Notification Settings Methods
  protected toggleNotification(id: string): void {
    const current = this.notifications();
    const updated = current.map((n) =>
      n.id === id ? { ...n, enabled: !n.enabled } : n
    );
    this.notifications.set(updated);
  }

  protected saveNotificationSettings(): void {
    console.log('Saving notification settings:', this.notifications());
    // TODO: Call backend service
  }

  // Team Management Methods
  protected addTeamMember(): void {
    console.log('Opening add team member modal');
    // TODO: Open modal to add team member
  }

  protected editTeamMember(member: TeamMember): void {
    console.log('Editing team member:', member);
    // TODO: Open modal to edit team member
  }

  protected deleteTeamMember(memberId: string): void {
    const confirmed = confirm(
      'Are you sure you want to remove this team member?'
    );
    if (confirmed) {
      const current = this.teamMembers();
      const updated = current.filter((m) => m.id !== memberId);
      this.teamMembers.set(updated);
      console.log('Team member removed');
    }
  }

  protected getRoleBadgeClass(role: TeamMember['role']): string {
    switch (role) {
      case 'Super Admin':
        return 'badge--super-admin';
      case 'Admin':
        return 'badge--admin';
      case 'Manager':
        return 'badge--manager';
      default:
        return 'badge--admin';
    }
  }
}
