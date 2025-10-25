import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../../../../../shared/ui/input/input.component';
import { FilterSelectComponent } from '../../../../../../shared/admin-ui/filter-select/filter-select.component';

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
  @Output() close = new EventEmitter<void>();

  public inviteForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.inviteForm = this.fb.group({
      title: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      event: ['', Validators.required],
      message: [''],
    });
  }

  public onSubmit(): void {
    if (this.inviteForm.valid) {
      console.log('Inviting user:', this.inviteForm.value);
      this.close.emit(); // close after submit
    } else {
      this.inviteForm.markAllAsTouched();
    }
  }

  public onCancel(): void {
    this.close.emit();
  }
}
