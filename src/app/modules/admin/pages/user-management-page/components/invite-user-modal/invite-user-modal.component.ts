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

  public onSubmit(): void {
    if (this.inviteForm.valid) {
      console.log('Inviting user:', this.inviteForm.value);
      this.close.emit();
    } else {
      this.inviteForm.markAllAsTouched();
    }
  }

  /** Called when user cancels invitation */
  public onCancel(): void {
    this.close.emit();
  }
}
