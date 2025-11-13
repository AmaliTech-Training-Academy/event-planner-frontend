import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { OrderDetails } from '../../../../core/models/payment.model'; 
import { MOCK_ORDER_DETAILS } from '../../../../core/data/payment-success.mock';

@Component({
  selector: 'app-event-payment-success',
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './event-payment-success.component.html',
  styleUrl: './event-payment-success.component.scss'
})
export class EventPaymentSuccessComponent implements OnInit{
private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly routes = APP_ROUTES;

  protected orderDetails = signal<OrderDetails | null>(null);

  public ngOnInit(): void {
    // TODO: Fetch order ID from route.
    this.loadOrderDetails();
  }

  private loadOrderDetails(): void {
    // TODO: API Call
    

    // Using mock data for now:
    this.orderDetails.set(MOCK_ORDER_DETAILS);
  }

  protected onBackToHome(): void {
    this.router.navigate([this.routes.EXPLORE]); 
  }

  protected onDownloadReceipt(): void {
    // TODO: Implement receipt download logic 
    
  }
}

