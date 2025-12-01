import {
  Component,
  input,
  output,
  computed,
  HostListener,
  OnInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { InputComponent } from '../../ui/input/input.component';
import { QuantityInputComponent } from '../../ui/quantity-input/quantity-input.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { EventDetail, RegisterEventBody, TicketType } from '@app/core/models/event.model';
import { EventsServiceService } from '../../../core/services/events.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';

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
export class RegistrationModalComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription()
  public currentEvent = input.required<EventDetail | null>();
  public selectedTicket = input.required<TicketType | null>();
  public cancelRegistration = output<void>();
  protected loading = signal(false);
  protected fullName: string = '';
  protected email: string = '';
  protected ticketCount = 1;
  protected isPaid = computed(() => (this.selectedTicket()?.price || 0) > 0);


  constructor(private readonly eventService: EventsServiceService, private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.subscription = this.eventService.loading$.subscribe({
      next: (value) => {
        this.loading.set(value)
      }
    })
  }



  protected getErrorMessage(control: NgModel | null) {
  if (!control || !control.touched) return '';

  if (control.errors?.['required']) return 'This field is required';
  if (control.errors?.['email']) return 'Enter a valid email address';

  return '';
}


  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  @HostListener('document:keydown.escape', ['$event'])
  protected onEscapeKey(event: Event): void {
    event.preventDefault();
    this.onCancel();
  }

  protected onCancel(): void {
    if (this.loading()) return;
    this.cancelRegistration.emit();
  }

  protected capitalizeWords(text: string): string {
    return text
      .toLowerCase()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  protected onSubmit(): void {
    const requestData: RegisterEventBody = {
      ticketTypeId: this.selectedTicket()?.id || 0,
      numberOfTickets: this.ticketCount,
      fullName: this.fullName,
      email: this.email
    }
    const eventId = (this.currentEvent()?.id || 0).toString()
    this.eventService.register(eventId, requestData, this.currentEvent() as EventDetail, !this.selectedTicket()?.isPaid).subscribe({
      next: (response: any) => {
        if (this.isPaid()) {
          this.notificationService.success(
            "Event registration initiated. Make payment to complete the registration"
          );
          window.open(response.authorizationUrl || '', '_blank');
        }
      }
    })
  }
}
