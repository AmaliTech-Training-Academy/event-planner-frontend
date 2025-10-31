import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../../../../../shared/ui/input/input.component';
import { FilterSelectComponent } from '../../../../../../shared/admin-ui/filter-select/filter-select.component';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { USER_ROLES } from '../../../../../../core/constants/user.constants';

@Component({
  selector: 'app-invite-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    FilterSelectComponent,
    ButtonComponent,
  ],
  templateUrl: './invite-user-modal.component.html',
  styleUrls: ['./invite-user-modal.component.scss'],
})
export class InviteUserModalComponent {
  @Output() public readonly close = new EventEmitter<void>();

  private readonly _fb = inject(FormBuilder);
  public readonly inviteForm: FormGroup = this._fb.group({
    title: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    event: ['', Validators.required],
    message: [''],
  });
  public readonly roles = [
    { label: USER_ROLES.ORGANIZER, value: USER_ROLES.ORGANIZER },
    { label: USER_ROLES.CO_ORGANIZER, value: USER_ROLES.CO_ORGANIZER },
    { label: USER_ROLES.ATTENDEE, value: USER_ROLES.ATTENDEE },
    { label: USER_ROLES.VENUE_STAFF, value: USER_ROLES.VENUE_STAFF },
    { label: USER_ROLES.ADMIN, value: USER_ROLES.ADMIN },
  ];
  public readonly events = [
    { label: 'Tech Conference 2025', value: 'tech_conf_2025' },
    { label: 'Music Fest 2025', value: 'music_fest_2025' },
    { label: 'Startup Pitch Night', value: 'startup_pitch' },
    { label: 'Community Meetup', value: 'community_meetup' },
  ];
  public onSubmit(): void {
    if (this.inviteForm.valid) {
      console.log('Inviting user:', this.inviteForm.value);
      this.close.emit();
    } else {
      this.inviteForm.markAllAsTouched();
    }
  }

  public onCancel(): void {
    this.close.emit();
  }
}
