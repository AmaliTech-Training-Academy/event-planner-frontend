import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventDetail, RegisterEventResponse } from '@app/core/models/event.model';
import { EventsServiceService } from '@app/core/services/events.service';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';

@Component({
  selector: 'app-event-payment-success',
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './event-payment-success.component.html',
  styleUrl: './event-payment-success.component.scss'
})
export class EventPaymentSuccessComponent implements OnInit {
  protected readonly routes = APP_ROUTES;
  protected readonly purchasedEvent = signal<EventDetail | null>(null)
  protected orderDetails = signal<RegisterEventResponse | null>(null);
  protected paystackRef: string = '';

  constructor(private readonly router: Router, private readonly route: ActivatedRoute, private readonly eventService: EventsServiceService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as
      | { eventData: EventDetail; eventResponse: RegisterEventResponse }
      | undefined;

    const paystackRef = this.route.snapshot.queryParamMap.get('reference');

    if (state) {
      this.purchasedEvent.set(state.eventData);
      this.orderDetails.set(state.eventResponse);
    }
    else if (paystackRef) {
      this.paystackRef = paystackRef;
    }
    else {
      router.navigate([APP_ROUTES.EXPLORE])
      return
    }

  }

  private fetchOrderDetailsByReference(paystackRef: string) {
    this.eventService.getReciept(this.paystackRef).subscribe({
      next: (response) => {
        this.orderDetails.set(response)
      }
    })
  }

  public ngOnInit(): void {
    if (this.paystackRef) {
      this.fetchOrderDetailsByReference(this.paystackRef);
    }
  }


  protected onBackToHome(): void {
    this.router.navigate([this.routes.EXPLORE]);
  }

}

