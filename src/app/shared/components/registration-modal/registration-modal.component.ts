import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { InputComponent } from '../../ui/input/input.component';
import { QuantityInputComponent } from '../../ui/quantity-input/quantity-input.component';
import { ButtonComponent } from '../../ui/button/button.component';


import { RegistrationInfo } from '../../../core/models/event.model';

@Component({
  selector: 'app-registration-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    InputComponent,
    QuantityInputComponent,
    ButtonComponent,
  ],
  templateUrl: './registration-modal.component.html',
  styleUrl: './registration-modal.component.scss',
})
export class RegistrationModalComponent {
  public registrationInfo = input.required<RegistrationInfo>();
  public cancelRegistration = output<void>();
  public submitRegistration = output<any>();

 
  protected fullName = '';
  protected email = '';
  protected ticketCount = 1;

  
  protected isPaid = computed(() => this.registrationInfo().ticketPrice > 0);

  protected onCancel(): void {
    this.cancelRegistration.emit();
  }

  protected onSubmit(): void {
    this.submitRegistration.emit({
      fullName: this.fullName,
      email: this.email,
      tickets: this.isPaid() ? this.ticketCount : 1, 
    });
  }
}

