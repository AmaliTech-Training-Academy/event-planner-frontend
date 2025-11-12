import { Component, input, output, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../ui/button/button.component';
import { EventCard } from '../../../core/models/event.model';
import { APP_ROUTES } from '../../../core/constants/app-routes.constants';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, ButtonComponent],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCardComponent {
 
  public event = input.required<EventCard>();
  
  public variant = input<'explore' | 'manage' | 'view-events'>('explore');

  
  public manageEvent = output<EventCard>();

  
  protected readonly routes = APP_ROUTES;
  private readonly router = inject(Router);

  
  protected navigateToDetails(): void {
    this.router.navigate([this.routes.EVENT_DETAILS, this.event().id]);
  }
  protected onManageClick(): void {
    this.manageEvent.emit(this.event());
  }
}