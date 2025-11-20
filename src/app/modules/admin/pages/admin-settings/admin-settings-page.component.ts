import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  signal,
  inject,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  AddTeamMemberModalComponent,
  TeamMemberPayload,
} from './add-team-member/add-team-member.component';
import {
  SecuritySettings,
  NotificationSettings,
  TeamMember,
  UpdateSecuritySettingsPayload,
  UpdateNotificationSettingsPayload,
} from '../../../../core/models/platform-settings.model';
import { PlatformSettingsService } from '@app/core/services/platform-settings-management.service';
import { PlatformStateService } from '@app/core/services/platform-state.service';
import { EditProfileComponent } from "../admin-edit-profile/admin-edit-profile.component";
import { Router } from '@angular/router';
import { InviteUserModalComponent } from "../user-management-page/components/invite-user-modal/invite-user-modal.component";

interface SecurityForm {
  platformName: FormControl<string | null>;
  platformUrl: FormControl<string | null>;
  contactEmail: FormControl<string | null>;
  platformDescription: FormControl<string | null>;
  maintenanceMode: FormControl<boolean>;
}

interface NotificationItem {
  id: keyof NotificationSettings;
  title: string;
  description: string;
  enabled: boolean;
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
    EditProfileComponent,
    InviteUserModalComponent,
  ],
  templateUrl: './admin-settings-page.component.html',
  styleUrls: ['./admin-settings-page.component.scss'],
})
export class AdminSettingsPageComponent implements OnInit, OnDestroy {
  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _notificationService: NotificationService =
    inject(NotificationService);
  private readonly _platformSettingsService: PlatformSettingsService = inject(
    PlatformSettingsService
  );
  private readonly _platformStateService: PlatformStateService =
    inject(PlatformStateService);

  private readonly router = inject(Router);

  private readonly _destroy$: Subject<void> = new Subject<void>();

  @ViewChild(AddTeamMemberModalComponent)
  private _addTeamMemberModal?: AddTeamMemberModalComponent;
  public showInviteAdminModal = signal(false);
  protected readonly activeTab = signal<'general' | 'notifications' | 'team'>(
    'general'
  );
  protected readonly isSubmitting = signal<boolean>(false);
  protected readonly hasAttemptedSubmit = signal<boolean>(false);
  protected readonly showAddTeamMemberModal = signal<boolean>(false);

  protected readonly securityForm: FormGroup<SecurityForm>;
  protected readonly notifications = signal<NotificationItem[]>([]);
  protected readonly teamMembers = signal<TeamMember[]>([]);

  constructor() {
    this.securityForm = this._createSecurityForm();
  }

  public ngOnInit(): void {
    this._loadAllSettings();
    this._subscribeToSettingsChanges();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  protected switchTab(tab: 'general' | 'notifications' | 'team'): void {
    this.activeTab.set(tab);
  }

  protected saveSecuritySettings(): void {
    this.hasAttemptedSubmit.set(true);
    this.securityForm.markAllAsTouched();

    if (this.securityForm.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);

    const payload: UpdateSecuritySettingsPayload = {
      platformName: this.securityForm.value.platformName || undefined,
      platformUrl: this.securityForm.value.platformUrl || undefined,
      contactEmail: this.securityForm.value.contactEmail || undefined,
      platformDescription:
        this.securityForm.value.platformDescription || undefined,
      maintenanceMode: this.securityForm.value.maintenanceMode,
    };

    this._platformSettingsService
      .updateSecuritySettings(payload)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (): void => {
          this.isSubmitting.set(false);
          this.hasAttemptedSubmit.set(false);
          this._notificationService.success(
            'Security settings saved successfully!'
          );

          // Immediately update the platform state
          if (payload.platformName) {
            this._platformStateService.updatePlatformName(payload.platformName);
          }
        },
        error: (): void => {
          this.isSubmitting.set(false);
        },
      });
  }

  protected saveNotificationSettings(): void {
    const currentNotifications: NotificationItem[] = this.notifications();
    const payload: UpdateNotificationSettingsPayload = {
      eventCreation:
        currentNotifications.find((n) => n.id === 'eventCreation')?.enabled ||
        false,
      paymentFailures:
        currentNotifications.find((n) => n.id === 'paymentFailures')?.enabled ||
        false,
      platformErrors:
        currentNotifications.find((n) => n.id === 'platformErrors')?.enabled ||
        false,
    };

    this._platformSettingsService
      .updateNotificationSettings(payload)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (): void => {
          this._notificationService.success(
            'Notification settings saved successfully!'
          );
        },
        error: (): void => {
          // Error is handled by the service
        },
      });
  }

  
  protected toggleNotification(
    notificationId: keyof NotificationSettings
  ): void {
    const updatedNotifications: NotificationItem[] = this.notifications().map(
      (notification: NotificationItem) =>
        notification.id === notificationId
          ? { ...notification, enabled: !notification.enabled }
          : notification
    );
    this.notifications.set(updatedNotifications);
  }

  protected addTeamMember(): void {
    this.showInviteAdminModal.set(true);
  }

  protected handleAddTeamMemberSubmit(payload: TeamMemberPayload): void {
    this._addTeamMemberModal?.setSubmitting(true);

    // Simulate API call - replace with actual service call when available
    setTimeout((): void => {
      const newMember: TeamMember = {
        id: Date.now(),
        email: payload.email,
        fullName: payload.fullName,
        profilePicture: 'icons/user-avatar.png',
        role: 'ADMIN',
        isActive: true,
      };

      this.teamMembers.set([...this.teamMembers(), newMember]);
      this._addTeamMemberModal?.setSubmitting(false);
      this.showAddTeamMemberModal.set(false);
      this._notificationService.success('Team member added successfully!');
    }, 1500);
  }

  protected handleAddTeamMemberClose(): void {
    this.showInviteAdminModal.set(false);
  }
  handleInviteAdminSuccess() {
  this.showInviteAdminModal.set(false);
}

  protected editTeamMember(member: TeamMember): void {
    // Navigate to the edit profile page with the member's ID
    this.router.navigate(['/admin/profile', member.id]);
  }
  protected toggleMemberStatus(memberId: number): void {
    const updatedMembers: TeamMember[] = this.teamMembers().map(
      (member: TeamMember) => (member.id === memberId ? { ...member } : member)
    );
    this.teamMembers.set(updatedMembers);
    this._notificationService.success('Member status updated!');
  }

  protected getRoleBadgeClass(role: string): string {
    const roleMap: Record<string, string> = {
      ADMIN: 'badge--admin',
      EDITOR: 'badge--editor',
      VIEWER: 'badge--viewer',
    };
    return roleMap[role] || 'badge--default';
  }

  protected hasFieldError(fieldName: keyof SecurityForm): boolean {
    const field: FormControl | null = this.securityForm?.get(
      fieldName
    ) as FormControl;
    return !!(field?.invalid && (field?.touched || this.hasAttemptedSubmit()));
  }

  protected getFieldErrorMessage(fieldName: keyof SecurityForm): string {
    const field: FormControl | null = this.securityForm?.get(
      fieldName
    ) as FormControl;
    if (!field?.errors) {
      return '';
    }

    const errors = field.errors;
    switch (true) {
      case !!errors?.['required']:
        return `${this._capitalize(fieldName)} is required`;
      case !!errors?.['email']:
        return 'Please enter a valid email address';
      case !!errors?.['pattern']:
        return 'Please enter a valid URL';
      default:
        return 'Invalid input';
    }
  }

  private _loadAllSettings(): void {
    this._platformSettingsService.loadAllSettings();
  }

  private _subscribeToSettingsChanges(): void {
    // Subscribe to security settings changes
    this._platformSettingsService.securitySettings$
      .pipe(takeUntil(this._destroy$))
      .subscribe((settings: SecuritySettings | null): void => {
        if (settings) {
          this.securityForm.patchValue({
            platformName: settings.platformName,
            platformUrl: settings.platformUrl,
            contactEmail: settings.contactEmail,
            platformDescription: settings.platformDescription,
            maintenanceMode: settings.maintenanceMode,
          });
        }
      });

    // Subscribe to notification settings changes
    this._platformSettingsService.notificationSettings$
      .pipe(takeUntil(this._destroy$))
      .subscribe((settings: NotificationSettings | null): void => {
        if (settings) {
          const notifications: NotificationItem[] = [
            {
              id: 'eventCreation',
              title: 'Event Creation Notifications',
              description: 'Receive notifications when new events are created',
              enabled: settings.eventCreation,
            },
            {
              id: 'paymentFailures',
              title: 'Payment Failure Notifications',
              description:
                'Receive notifications for payment processing failures',
              enabled: settings.paymentFailures,
            },
            {
              id: 'platformErrors',
              title: 'Platform Error Notifications',
              description: 'Receive notifications for system errors and issues',
              enabled: settings.platformErrors,
            },
          ];
          this.notifications.set(notifications);
        }
      });

    // Subscribe to team members changes
    this._platformSettingsService.teamMembers$
      .pipe(takeUntil(this._destroy$))
      .subscribe((members: TeamMember[]): void => {
        this.teamMembers.set(members);
      });
  }

  private _createSecurityForm(): FormGroup<SecurityForm> {
    return this._fb.group({
      platformName: this._fb.control('', [Validators.required]),
      platformUrl: this._fb.control('', [
        Validators.required,
        Validators.pattern(/^https?:\/\/.+/),
      ]),
      contactEmail: this._fb.control('', [
        Validators.required,
        Validators.email,
      ]),
      platformDescription: this._fb.control('', [Validators.required]),
      maintenanceMode: this._fb.control(false, { nonNullable: true }),
    });
  }

  private _capitalize(text: string): string {
    return text?.charAt(0)?.toUpperCase() + text?.slice(1);
  }
}
