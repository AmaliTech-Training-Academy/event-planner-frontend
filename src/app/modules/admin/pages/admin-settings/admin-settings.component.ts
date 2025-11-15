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
import { NotificationSetting, SecurityForm, SecuritySettings, TabType, TeamMember } from '@app/modules/attendee/models/admin-settings.types';
import { DEFAULT_NOTIFICATIONS, DEFAULT_SECURITY_SETTINGS, DEFAULT_TEAM_MEMBERS, ROLE_BADGE_CLASSES } from '@app/core/constants/admin-settings.constants';


@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.scss',
})
export class AdminSettingsComponent implements OnInit {
  // ===== Injected Services =====
  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _layoutService: LayoutService = inject(LayoutService);

  // ===== Private Writable Signals =====
  private readonly _activeTab: WritableSignal<TabType> =
    signal<TabType>('general');
  private readonly _hasAttemptedSubmit: WritableSignal<boolean> =
    signal<boolean>(false);
  private readonly _isSubmitting: WritableSignal<boolean> =
    signal<boolean>(false);
  private readonly _notifications: WritableSignal<
    ReadonlyArray<NotificationSetting>
  > = signal<ReadonlyArray<NotificationSetting>>(DEFAULT_NOTIFICATIONS);
  private readonly _teamMembers: WritableSignal<ReadonlyArray<TeamMember>> =
    signal<ReadonlyArray<TeamMember>>(DEFAULT_TEAM_MEMBERS);

  // ===== Public Readonly Signals =====
  public readonly activeTab: Signal<TabType> = this._activeTab.asReadonly();
  public readonly hasAttemptedSubmit: Signal<boolean> =
    this._hasAttemptedSubmit.asReadonly();
  public readonly isSubmitting: Signal<boolean> =
    this._isSubmitting.asReadonly();
  public readonly notifications: Signal<ReadonlyArray<NotificationSetting>> =
    this._notifications.asReadonly();
  public readonly teamMembers: Signal<ReadonlyArray<TeamMember>> =
    this._teamMembers.asReadonly();

  // ===== Public Form =====
  public readonly securityForm: FormGroup<SecurityForm>;

  constructor() {
    this.securityForm = this._createSecurityForm();
  }

  public ngOnInit(): void {
    this._layoutService.pageTitle.set('Admin Settings');
    this._layoutService.logoSrc.set('icons/settings.png');
    this._layoutService.logoAlt.set('Admin Settings Icon');

    this._loadSecuritySettings();
  }

  // ===== Public Methods =====

  /**
   * Switch between tabs
   */
  public switchTab(tab: TabType): void {
    this._activeTab.set(tab);
  }

  /**
   * Save security settings form
   */
  public saveSecuritySettings(): void {
    this._hasAttemptedSubmit.set(true);
    this.securityForm.markAllAsTouched();

    if (this.securityForm.invalid || this._isSubmitting()) {
      return;
    }

    this._isSubmitting.set(true);

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
      this._isSubmitting.set(false);
      this._hasAttemptedSubmit.set(false);
      console.log('Settings saved successfully!');
    }, 1000);
  }

  /**
   * Check if a form field has an error
   */
  public hasFieldError(fieldName: keyof SecurityForm): boolean {
    const field: FormControl | null = this.securityForm.get(
      fieldName
    ) as FormControl | null;
    return !!(field?.invalid && (field?.touched || this._hasAttemptedSubmit()));
  }

  /**
   * Get error message for a form field
   */
  public getFieldErrorMessage(fieldName: keyof SecurityForm): string {
    const field: FormControl | null = this.securityForm.get(
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

    if (errors['pattern']) {
      return 'Please enter a valid URL (starting with http:// or https://)';
    }

    return 'Invalid input';
  }

  /**
   * Toggle notification setting
   */
  public toggleNotification(id: string): void {
    const current: ReadonlyArray<NotificationSetting> = this._notifications();
    const updated: ReadonlyArray<NotificationSetting> = current.map(
      (n: NotificationSetting) =>
        n.id === id ? { ...n, enabled: !n.enabled } : n
    );
    this._notifications.set(updated);
  }

  /**
   * Save notification settings
   */
  public saveNotificationSettings(): void {
    console.log('Saving notification settings:', this._notifications());
    // TODO: Call backend service
  }

  /**
   * Open modal to add team member
   */
  public addTeamMember(): void {
    console.log('Opening add team member modal');
    // TODO: Open modal to add team member
  }

  /**
   * Open menu for team member actions
   */
  public openMemberMenu(member: TeamMember): void {
    console.log('Opening menu for team member:', member);
    // TODO: Open dropdown menu with more options
  }

  /**
   * Open modal to edit team member
   */
  public editTeamMember(member: TeamMember): void {
    console.log('Editing team member:', member);
    // TODO: Open modal to edit team member
  }

  /**
   * Delete team member with confirmation
   */
  public deleteTeamMember(memberId: string): void {
    const confirmed: boolean = confirm(
      'Are you sure you want to remove this team member?'
    );

    if (confirmed) {
      const current: ReadonlyArray<TeamMember> = this._teamMembers();
      const updated: ReadonlyArray<TeamMember> = current.filter(
        (m: TeamMember) => m.id !== memberId
      );
      this._teamMembers.set(updated);
      console.log('Team member removed');
    }
  }

  /**
   * Get CSS class for role badge
   */
  public getRoleBadgeClass(role: TeamMember['role']): string {
    return ROLE_BADGE_CLASSES[role];
  }

  // ===== Private Methods =====

  /**
   * Create security settings form
   */
  private _createSecurityForm(): FormGroup<SecurityForm> {
    return this._fb.group({
      platformName: this._fb.control(DEFAULT_SECURITY_SETTINGS.platformName, [
        Validators.required,
      ]),
      platformUrl: this._fb.control(DEFAULT_SECURITY_SETTINGS.platformUrl, [
        Validators.required,
        Validators.pattern(/^https?:\/\/.+/),
      ]),
      contactEmail: this._fb.control(DEFAULT_SECURITY_SETTINGS.contactEmail, [
        Validators.required,
        Validators.email,
      ]),
      platformDescription: this._fb.control(
        DEFAULT_SECURITY_SETTINGS.platformDescription,
        [Validators.required]
      ),
      maintenanceMode: this._fb.control(
        DEFAULT_SECURITY_SETTINGS.maintenanceMode,
        { nonNullable: true }
      ),
    }) as unknown as FormGroup<SecurityForm>;
  }


  private _loadSecuritySettings(): void {
    // TODO: Load from backend service
    // For now, form already has default values
  }

  /**
   * Format field name for error messages
   */
  private _formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str: string) => str.toUpperCase())
      .trim();
  }
}
