import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  AddTeamMemberModalComponent,
  TeamMemberPayload,
} from './add-team-member/add-team-member.component';

interface SecurityForm {
  platformName: FormControl<string | null>;
  platformUrl: FormControl<string | null>;
  contactEmail: FormControl<string | null>;
  platformDescription: FormControl<string | null>;
  maintenanceMode: FormControl<boolean>;
}

interface Notification {
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
  role: string;
  active: boolean;
}

@Component({
  selector: 'app-admin-settings-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    AddTeamMemberModalComponent,
  ],
  templateUrl: './admin-settings-page.component.html',
  styleUrls: ['./admin-settings-page.component.scss'],
})
export class AdminSettingsPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationService);

  @ViewChild(AddTeamMemberModalComponent)
  addTeamMemberModal?: AddTeamMemberModalComponent;

  protected readonly activeTab = signal<'general' | 'notifications' | 'team'>(
    'general'
  );
  protected readonly isSubmitting = signal(false);
  protected readonly hasAttemptedSubmit = signal(false);
  protected readonly showAddTeamMemberModal = signal(false);

  protected readonly securityForm: FormGroup<SecurityForm>;
  protected readonly notifications = signal<Notification[]>([
    {
      id: '1',
      title: 'Email Notifications',
      description: 'Receive email notifications for important updates',
      enabled: true,
    },
    {
      id: '2',
      title: 'Push Notifications',
      description: 'Receive push notifications on your device',
      enabled: false,
    },
    {
      id: '3',
      title: 'SMS Notifications',
      description: 'Receive SMS notifications for critical alerts',
      enabled: true,
    },
  ]);

  protected readonly teamMembers = signal<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@eventhub.com',
      avatar: 'icons/user-avatar.png',
      role: 'Admin',
      active: true,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@eventhub.com',
      avatar: 'icons/user-avatar.png',
      role: 'Editor',
      active: true,
    },
  ]);

  constructor() {
    this.securityForm = this.createSecurityForm();
  }

  ngOnInit(): void {
    this.loadSecuritySettings();
  }

  protected switchTab(tab: 'general' | 'notifications' | 'team'): void {
    this.activeTab.set(tab);
  }

  protected saveSecuritySettings(): void {
    this.hasAttemptedSubmit.set(true);
    this.securityForm.markAllAsTouched();

    if (this.securityForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.notificationService.success('Security settings saved successfully!');
      this.hasAttemptedSubmit.set(false);
    }, 1500);
  }

  protected saveNotificationSettings(): void {
    this.notificationService.success(
      'Notification settings saved successfully!'
    );
  }

  protected toggleNotification(notificationId: string): void {
    const updatedNotifications = this.notifications().map((n) =>
      n.id === notificationId ? { ...n, enabled: !n.enabled } : n
    );
    this.notifications.set(updatedNotifications);
  }

  protected addTeamMember(): void {
    this.showAddTeamMemberModal.set(true);
  }

  protected handleAddTeamMemberSubmit(payload: TeamMemberPayload): void {
    // Set the modal to submitting state
    this.addTeamMemberModal?.setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // Add the new team member to the list
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: payload.fullName,
        email: payload.email,
        avatar: 'icons/user-avatar.png',
        role: 'Editor',
        active: true,
      };

      this.teamMembers.set([...this.teamMembers(), newMember]);

      // Close modal and reset submitting state
      this.addTeamMemberModal?.setSubmitting(false);
      this.showAddTeamMemberModal.set(false);
      this.notificationService.success('Team member added successfully!');
    }, 1500);
  }

  protected handleAddTeamMemberClose(): void {
    this.showAddTeamMemberModal.set(false);
  }

  protected editTeamMember(member: TeamMember): void {
    console.log('Edit team member:', member);
    this.notificationService.info('Edit functionality coming soon!');
  }

  protected toggleMemberStatus(memberId: string): void {
    const updatedMembers = this.teamMembers().map((m) =>
      m.id === memberId ? { ...m, active: !m.active } : m
    );
    this.teamMembers.set(updatedMembers);
    this.notificationService.success('Member status updated!');
  }

  protected getRoleBadgeClass(role: string): string {
    const roleMap: Record<string, string> = {
      Admin: 'badge--admin',
      Editor: 'badge--editor',
      Viewer: 'badge--viewer',
    };
    return roleMap[role] || 'badge--default';
  }

  protected hasFieldError(fieldName: keyof SecurityForm): boolean {
    const field = this.securityForm?.get(fieldName);
    return !!(field?.invalid && (field?.touched || this.hasAttemptedSubmit()));
  }

  protected getFieldErrorMessage(fieldName: keyof SecurityForm): string {
    const field = this.securityForm?.get(fieldName);
    if (!field?.errors) return '';

    const errors = field.errors;
    switch (true) {
      case !!errors?.['required']:
        return `${this.capitalize(fieldName)} is required`;
      case !!errors?.['email']:
        return 'Please enter a valid email address';
      case !!errors?.['pattern']:
        return 'Please enter a valid URL';
      default:
        return 'Invalid input';
    }
  }

  private loadSecuritySettings(): void {
    // Load settings from API or local storage
    this.securityForm.patchValue({
      platformName: 'Event Hub',
      platformUrl: 'https://eventhub.com',
      contactEmail: 'support@eventhub.com',
      platformDescription:
        'EventHub is a comprehensive event management platform for organizers and attendees.',
      maintenanceMode: false,
    });
  }

  private createSecurityForm(): FormGroup<SecurityForm> {
    return this.fb.group({
      platformName: this.fb.control('', [Validators.required]),
      platformUrl: this.fb.control('', [
        Validators.required,
        Validators.pattern(/^https?:\/\/.+/),
      ]),
      contactEmail: this.fb.control('', [
        Validators.required,
        Validators.email,
      ]),
      platformDescription: this.fb.control('', [Validators.required]),
      maintenanceMode: this.fb.control(false, { nonNullable: true }),
    });
  }

  private capitalize(text: string): string {
    return text?.charAt(0)?.toUpperCase() + text?.slice(1);
  }
}
