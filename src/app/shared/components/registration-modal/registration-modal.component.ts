import { Component, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RegistrationInfo } from '../../../core/models/event.model';

import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputComponent } from '../../ui/input/input.component';
import { QuantityInputComponent } from '../../ui/quantity-input/quantity-input.component';

@Component({
  selector: 'app-registration-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    ButtonComponent,
    InputComponent,
    QuantityInputComponent,
  ],
  templateUrl: './registration-modal.component.html',
  styleUrl: './registration-modal.component.scss',
})
export class RegistrationModalComponent {
  public registrationInfo = input.required<RegistrationInfo>();

  public readonly cancelRegistration = output<void>();
  public readonly submitRegistration = output<any>();

  protected fullName = signal('');
  protected email = signal('');
  protected ticketCount = signal(1);

  protected ticketLabel = computed(() => {
    return `Number of ${this.registrationInfo().ticketName}s`;
  });

  protected onCancel(): void {
    this.cancelRegistration.emit();
  }

  protected onSubmit(): void {
    this.submitRegistration.emit({
      fullName: this.fullName(),
      email: this.email(),
      tickets: this.ticketCount(),
      ticketType: this.registrationInfo().ticketName,
    });
  }
}

