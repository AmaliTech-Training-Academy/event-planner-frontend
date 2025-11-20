import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  OnChanges,
  SimpleChanges,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  NonNullableFormBuilder,
} from '@angular/forms';
import { ButtonComponent } from '@app/shared/ui/button/button.component';
import { InputComponent } from '@app/shared/ui/input/input.component';
import {
  SecuritySettings,
  UpdateSecuritySettingsPayload,
} from '@app/core/models/platform-settings.model';
import { NotificationService } from '@app/core/services/notification.service';

interface SecuritySettingsForm {
  platformName: string;
  platformUrl: string;
  contactEmail: string;
  platformDescription: string;
  maintenanceMode: boolean;
}

@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss'],
})
export class GeneralSettingsComponent implements OnChanges {
  @Input() public settings: SecuritySettings | null = null;
  @Output() public save: EventEmitter<UpdateSecuritySettingsPayload> = new EventEmitter<UpdateSecuritySettingsPayload>();

  private readonly _fb = inject(NonNullableFormBuilder);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _notificationService = inject(NotificationService);

  protected readonly isSubmitting = signal(false);
  protected readonly hasAttemptedSubmit = signal(false);
  protected readonly securityForm = this._createForm();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['settings']?.currentValue) {
      this._updateFormWithSettings(changes['settings'].currentValue);
    }
  }

  protected saveSettings(): void {
    this.hasAttemptedSubmit.set(true);
    this.securityForm.markAllAsTouched();

    if (this.securityForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.securityForm.getRawValue();
    const payload: UpdateSecuritySettingsPayload = {
      platformName: formValue.platformName || undefined,
      platformUrl: formValue.platformUrl || undefined,
      contactEmail: formValue.contactEmail || undefined,
      platformDescription: formValue.platformDescription || undefined,
      maintenanceMode: formValue.maintenanceMode,
    };

    this.save.emit(payload);

    setTimeout(() => this.isSubmitting.set(false), 500);
  }

  protected hasFieldError(fieldName: keyof SecuritySettingsForm): boolean {
    const field = this.securityForm.get(fieldName);
    return !!(field?.invalid && (field?.touched || this.hasAttemptedSubmit()));
  }

  protected getFieldErrorMessage(
    fieldName: keyof SecuritySettingsForm
  ): string {
    const field = this.securityForm.get(fieldName);
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
      return 'Please enter a valid URL (must start with http:// or https://)';
    }

    return 'Invalid input';
  }

  private _createForm(): FormGroup {
    return this._fb.group({
      platformName: ['', [Validators.required]],
      platformUrl: [
        '',
        [Validators.required, Validators.pattern(/^https?:\/\/.+/)],
      ],
      contactEmail: ['', [Validators.required, Validators.email]],
      platformDescription: ['', [Validators.required]],
      maintenanceMode: [false],
    });
  }

  private _updateFormWithSettings(settings: SecuritySettings): void {
    this.securityForm.patchValue(
      {
        platformName: settings.platformName ?? '',
        platformUrl: settings.platformUrl ?? '',
        contactEmail: settings.contactEmail ?? '',
        platformDescription: settings.platformDescription ?? '',
        maintenanceMode: settings.maintenanceMode ?? false,
      },
      { emitEvent: false }
    );

    this.hasAttemptedSubmit.set(false);
    this.securityForm.markAsPristine();
    this.securityForm.markAsUntouched();
  }

  private _formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }
}
